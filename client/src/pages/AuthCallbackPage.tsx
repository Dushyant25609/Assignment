import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { toast } from 'react-hot-toast';

export const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');
      const mode = searchParams.get('mode') || 'login';

      if (error) {
        console.error('OAuth error:', error);
        toast.error('Authentication failed. Please try again.');
        // Redirect to auth page with error
        navigate('/auth?error=oauth_failed', { replace: true });
        return;
      }

      if (token) {
        try {
          // Fetch user data with the token
          const response = await fetch('http://localhost:5001/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setAuth(userData.user, token);
            
            // Show success message based on mode
            const isNewUser = mode === 'signup';
            const message = isNewUser 
              ? `Welcome to the app, ${userData.user.name}!` 
              : `Welcome back, ${userData.user.name}!`;
            toast.success(message);
            
            // Redirect to bookmarks page (home)
            navigate('/', { replace: true });
          } else {
            throw new Error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error processing OAuth callback:', error);
          navigate('/auth?error=oauth_failed', { replace: true });
        }
      } else {
        // No token found, redirect to auth
        navigate('/auth', { replace: true });
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, setAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Completing authentication...
        </p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
