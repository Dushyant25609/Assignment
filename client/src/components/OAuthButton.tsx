import { Button } from './ui/button';
import { GoogleIcon, GitHubIcon, FacebookIcon, TwitterIcon } from './OAuthIcons';

type Provider = 'google' | 'github' | 'facebook' | 'twitter';

interface ProviderConfig {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  url: string;
  color: string;
}

interface OAuthButtonProps {
  provider: Provider;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  mode?: 'login' | 'signup';
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://assignment-0bxg.onrender.com/api'

const providerConfig: Record<Provider, ProviderConfig> = {
  google: {
    icon: GoogleIcon,
    label: 'Google',
    url: `${API_BASE_URL}/auth/google`,
    color: 'bg-red-500 hover:bg-red-600'
  },
  github: {
    icon: GitHubIcon,
    label: 'GitHub',
    url: `${API_BASE_URL}/auth/github`,
    color: 'bg-gray-800 hover:bg-gray-900'
  },
  facebook: {
    icon: FacebookIcon,
    label: 'Facebook',
    url: `${API_BASE_URL}/auth/facebook`,
    color: 'bg-blue-600 hover:bg-blue-700'
  },
  twitter: {
    icon: TwitterIcon,
    label: 'Twitter',
    url: `${API_BASE_URL}/auth/twitter`,
    color: 'bg-sky-500 hover:bg-sky-600'
  }
}

export const OAuthButton = ({ 
  provider, 
  children, 
  disabled = false, 
  className = '',
  mode = 'login'
}: OAuthButtonProps) => {
  const config = providerConfig[provider];
  const IconComponent = config.icon;

  const handleOAuthLogin = () => {
    if (disabled) return;
    
    // Redirect to the OAuth provider with mode parameter
    const url = `${config.url}?mode=${mode}`;
    window.location.href = url;
  };

  return (
    <Button
      onClick={handleOAuthLogin}
      disabled={disabled}
      variant="outline"
      className={`
        w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg
        ${config.color}
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      type="button"
    >
      <IconComponent className="w-5 h-5" />
      {children}
    </Button>
  );
};

export default OAuthButton;
