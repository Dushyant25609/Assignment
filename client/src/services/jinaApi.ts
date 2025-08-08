/**
 * Jina AI Summary API Service
 * Endpoint: GET https://r.jina.ai/http://<URL_ENCODED_TARGET_PAGE>
 * Features: No API key required, CORS enabled, ~60 calls/hour per IP limit
 */

export interface JinaSummaryResponse {
  summary: string
  error?: string
}

export const jinaApi = {
  /**
   * Generate summary for a given URL using Jina AI
   * @param url - The URL to summarize
   * @returns Promise with summary text or error
   */
  async generateSummary(url: string): Promise<JinaSummaryResponse> {
    try {
      // Validate URL format
      if (!url || typeof url !== 'string') {
        throw new Error('Invalid URL provided')
      }

      // Ensure URL has protocol
      const normalizedUrl = url.startsWith('http') ? url : `https://${url}`
      
      // Make request to Jina AI - don't double encode
      const response = await fetch(`https://r.jina.ai/${normalizedUrl}`, {
        method: 'GET',
        headers: {
          'Accept': 'text/plain',
        },
      })

      if (!response.ok) {
        throw new Error(`Jina AI request failed: ${response.status} ${response.statusText}`)
      }

      const summary = await response.text()
      
      return {
        summary: summary.trim() || 'No summary available for this URL.'
      }
    } catch (error) {
      console.error('Jina AI summary generation failed:', error)
      
      return {
        summary: '',
        error: error instanceof Error ? error.message : 'Failed to generate summary'
      }
    }
  },

  /**
   * Extract favicon URL from a given website URL
   * @param url - The website URL
   * @returns Favicon URL
   */
  extractFaviconUrl(url: string): string {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`)
      return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`
    } catch {
      return ''
    }
  },

  /**
   * Extract title from URL (basic implementation)
   * @param url - The website URL
   * @returns Basic title from domain
   */
  extractTitleFromUrl(url: string): string {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`)
      return urlObj.hostname.replace('www.', '').split('.')[0]
    } catch {
      return 'Bookmark'
    }
  }
}
