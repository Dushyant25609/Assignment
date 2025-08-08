import { CreateBookmarkRequest, UpdateBookmarkRequest } from '@/types/bookmark';
import prisma from '../../prisma/prisma';

export class BookmarkService {
  static async createBookmark(userId: string, data: CreateBookmarkRequest) {
    console.log('Creating bookmark for user:', userId, 'URL:', data.url);
    
    try {
      // Try to get metadata first
      const { summary, favicon } = await this.fetchUrlMetadata(data.url);
      
      // Create bookmark with metadata
      const bookmark = await prisma.bookmark.create({
        data: {
          ...data,
          summary,
          favicon,
          userId,
        },
      });
      
      console.log('Created bookmark with metadata:', bookmark.id);
      return bookmark;
    } catch (error) {
      console.error('Error in createBookmark:', error);
      
      // Fallback: create bookmark without metadata
      const bookmark = await prisma.bookmark.create({
        data: {
          ...data,
          summary: '',
          favicon: '',
          userId,
        },
      });
      
      // Try to update metadata in background
      this.updateBookmarkMetadata(bookmark.id, data.url).catch((bgError: any) => {
        console.error('Background metadata update failed for bookmark:', bookmark.id, bgError);
      });
      
      return bookmark;
    }
  }

  static async updateBookmarkMetadata(bookmarkId: string, url: string) {
    console.log('Starting metadata update for bookmark:', bookmarkId, 'URL:', url);
    try {
      const { summary, favicon } = await this.fetchUrlMetadata(url);
      console.log('Fetched metadata - Summary:', summary, 'Favicon:', favicon);
      
      const result = await prisma.bookmark.update({
        where: { id: bookmarkId },
        data: { summary, favicon },
      });
      
      console.log('Successfully updated bookmark metadata for:', bookmarkId);
      return result;
    } catch (error) {
      console.error('Failed to update bookmark metadata:', error);
      throw error;
    }
  }

  static async getUserBookmarks(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const [bookmarks, total] = await Promise.all([
      prisma.bookmark.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.bookmark.count({ where: { userId } }),
    ]);

    return {
      bookmarks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  static async getBookmarkById(id: string, userId: string) {
    return await prisma.bookmark.findFirst({
      where: { id, userId },
    });
  }

  static async updateBookmark(id: string, userId: string, data: UpdateBookmarkRequest) {
    // If URL is being updated, regenerate metadata
    let updateData = { ...data };
    
    if (data.url) {
      try {
        const { summary, favicon } = await this.fetchUrlMetadata(data.url);
        updateData = { ...updateData, summary, favicon };
      } catch (error) {
        console.error('Failed to fetch URL metadata:', error);
      }
    }

    return await prisma.bookmark.updateMany({
      where: { id, userId },
      data: updateData,
    });
  }

  static async deleteBookmark(id: string, userId: string) {
    return await prisma.bookmark.deleteMany({
      where: { id, userId },
    });
  }

  static async searchBookmarks(userId: string, query: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const [bookmarks, total] = await Promise.all([
      prisma.bookmark.findMany({
        where: {
          userId,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { summary: { contains: query, mode: 'insensitive' } },
          ],
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.bookmark.count({
        where: {
          userId,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { summary: { contains: query, mode: 'insensitive' } },
          ],
        },
      }),
    ]);

    return {
      bookmarks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  private static async fetchUrlMetadata(url: string): Promise<{ summary: string; favicon: string }> {
    console.log('fetchUrlMetadata called with URL:', url);
    try {
      // Ensure URL has proper protocol
      const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
      console.log('Normalized URL:', normalizedUrl);
      
      // Use correct Jina AI format without encoding
      const jinaUrl = `https://r.jina.ai/${normalizedUrl}`;
      console.log('Fetching from Jina AI:', jinaUrl);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const response = await fetch(jinaUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/plain',
          'User-Agent': 'Mozilla/5.0 (compatible; BookmarkBot/1.0)'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log('Jina AI response status:', response.status);
      
      if (!response.ok) {
        console.warn(`Jina AI request failed: ${response.status} ${response.statusText}`);
        return this.getFallbackMetadata(normalizedUrl);
      }
      
      const fullSummary = await response.text();
      console.log('Raw Jina AI response length:', fullSummary.length);
      console.log('Raw Jina AI response preview:', fullSummary.substring(0, 200));
      
      // Clean up the full summary but keep it complete
      const cleanedSummary = this.cleanFullSummary(fullSummary);
      
      // Extract favicon from URL
      const urlObj = new URL(normalizedUrl);
      const favicon = `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
      
      console.log('Successfully generated full summary length:', cleanedSummary.length);
      
      return { 
        summary: cleanedSummary || 'No summary available for this URL.', 
        favicon 
      };
    } catch (error) {
      console.error('Error fetching URL metadata:', error);
      const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
      return this.getFallbackMetadata(normalizedUrl);
    }
  }

  private static cleanFullSummary(fullText: string): string {
    try {
      // Clean up the text but keep it complete
      let cleanText = fullText.trim()
        .replace(/^Title:\s*/gm, '') // Remove title prefix
        .replace(/^URL Source:\s*/gm, '') // Remove URL source prefix
        .replace(/^Published Time:\s*/gm, '') // Remove published time prefix
        .replace(/^Warning:.*$/gm, '') // Remove warnings
        .replace(/^Markdown Content:\s*/gm, '') // Remove markdown content prefix
        .replace(/\n{3,}/g, '\n\n') // Reduce excessive newlines
        .replace(/\s{2,}/g, ' ') // Reduce multiple spaces within lines
        .trim();
      
      // Return the full cleaned text
      return cleanText || 'Content retrieved from URL';
    } catch (error) {
      console.error('Error cleaning full summary:', error);
      return fullText || 'Error processing summary';
    }
  }

  private static getFallbackMetadata(url: string): { summary: string; favicon: string } {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace('www.', '');
      const path = urlObj.pathname;
      
      // Create a more descriptive fallback summary based on URL structure
      let summary = '';
      
      if (path && path !== '/' && path.length > 1) {
        const pathParts = path.split('/').filter(p => p && p !== 'index.html');
        const lastPart = pathParts[pathParts.length - 1];
        
        if (lastPart) {
          // Convert URL slug to readable text
          const readable = lastPart
            .replace(/[-_]/g, ' ')
            .replace(/\.(html|php|aspx?)$/i, '')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          
          summary = `Explore "${readable}" on ${domain}`;
        } else {
          summary = `Discover valuable content and resources from ${domain}`;
        }
      } else {
        // Main domain - create category-based summary
        if (domain.includes('github')) {
          summary = `Open source projects and code repositories on ${domain}`;
        } else if (domain.includes('stackoverflow') || domain.includes('stack')) {
          summary = `Programming questions and developer discussions on ${domain}`;
        } else if (domain.includes('medium') || domain.includes('blog')) {
          summary = `Articles and insights from ${domain}`;
        } else if (domain.includes('youtube') || domain.includes('video')) {
          summary = `Video content and tutorials from ${domain}`;
        } else if (domain.includes('news') || domain.includes('reuters') || domain.includes('bbc')) {
          summary = `Latest news and updates from ${domain}`;
        } else if (domain.includes('wikipedia') || domain.includes('wiki')) {
          summary = `Knowledge and information from ${domain}`;
        } else {
          summary = `Valuable content and resources from ${domain}`;
        }
      }
      
      return {
        summary,
        favicon: `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`
      };
    } catch (error) {
      return {
        summary: 'Interesting content to explore',
        favicon: ''
      };
    }
  }

  private static processAndConcentrateSummary(fullText: string, url: string): string {
    try {
      // Clean up the text and remove unwanted elements
      let cleanText = fullText.trim()
        .replace(/^#+\s*/gm, '') // Remove markdown headers
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
        .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
        .replace(/```[\s\S]*?```/g, '') // Remove code blocks
        .replace(/`([^`]+)`/g, '$1') // Remove inline code
        .replace(/\n{3,}/g, ' ') // Replace multiple newlines with space
        .replace(/\s{2,}/g, ' ') // Reduce multiple spaces
        .trim();
      
      // Get domain for context
      const domain = new URL(url).hostname.replace('www.', '');
      
      // Extract title if available in the Jina response
      const titleMatch = cleanText.match(/^Title:\s*(.+)/m);
      const title = titleMatch ? titleMatch[1].trim() : '';
      
      // Split into sentences and find meaningful content
      const sentences = cleanText.split(/[.!?]+/)
        .map(s => s.trim())
        .filter(s => s.length > 20) // Only sentences with good length
        .filter(s => {
          const lower = s.toLowerCase();
          return !lower.includes('cookie') && 
                 !lower.includes('privacy') && 
                 !lower.includes('navigation') && 
                 !lower.includes('menu') && 
                 !lower.includes('sign in') &&
                 !lower.includes('subscribe') &&
                 !lower.includes('footer') &&
                 !lower.includes('header') &&
                 !lower.includes('url source') &&
                 !lower.includes('published time') &&
                 !lower.includes('warning:') &&
                 !lower.includes('markdown content:');
        });
      
      // Find the best summary sentence
      let summary = '';
      
      // Look for sentences that actually describe content
      for (const sentence of sentences) {
        if (sentence.length >= 30 && sentence.length <= 150) {
          summary = sentence;
          break;
        }
      }
      
      // If no good sentence found, try to combine shorter ones
      if (!summary && sentences.length > 0) {
        const firstTwo = sentences.slice(0, 2);
        const combined = firstTwo.join('. ');
        if (combined.length <= 180) {
          summary = combined;
        } else {
          summary = sentences[0] || '';
        }
      }
      
      // Clean up and format the summary
      if (summary) {
        // Ensure it ends with proper punctuation
        if (!summary.match(/[.!?]$/)) {
          summary += '.';
        }
        
        // Limit length more strictly
        if (summary.length > 150) {
          const words = summary.split(' ');
          const truncated = words.slice(0, 25).join(' ');
          summary = truncated + (truncated.endsWith('.') ? '' : '...');
        }
        
        // Add domain context if the summary is very generic
        if (summary.length < 40 || summary.toLowerCase().includes('this') && !summary.includes(domain)) {
          summary = `${summary} (from ${domain})`;
        }
      }
      
      // Fallback if no good summary
      if (!summary || summary.length < 20) {
        if (title && title.length > 5) {
          summary = `"${title}" - Content from ${domain}`;
        } else {
          summary = `Discover content and insights from ${domain}`;
        }
      }
      
      return summary;
    } catch (error) {
      console.error('Error processing summary:', error);
      const domain = new URL(url).hostname.replace('www.', '');
      return `Explore content from ${domain}`;
    }
  }
}
