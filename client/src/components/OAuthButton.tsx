import { Button } from './ui/button';
import { GoogleIcon } from './OAuthIcons';

interface OAuthButtonProps {
  provider: 'google' | 'github' | 'facebook' | 'twitter';
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  mode?: 'login' | 'signup';
}

const providerConfig = {
  google: {
    icon: GoogleIcon,
    url: 'http://localhost:5001/api/auth/google',
    bgColor: 'bg-white hover:bg-gray-50 border border-gray-300',
    textColor: 'text-gray-700'
  },
  github: {
    icon: GoogleIcon, // Use Google icon for now, you can add GitHub icon later
    url: 'http://localhost:5001/api/auth/github',
    bgColor: 'bg-gray-800 hover:bg-gray-900',
    textColor: 'text-white'
  },
  facebook: {
    icon: GoogleIcon, // Use Google icon for now
    url: 'http://localhost:5001/api/auth/facebook',
    bgColor: 'bg-blue-600 hover:bg-blue-700',
    textColor: 'text-white'
  },
  twitter: {
    icon: GoogleIcon, // Use Google icon for now
    url: 'http://localhost:5001/api/auth/twitter',
    bgColor: 'bg-blue-400 hover:bg-blue-500',
    textColor: 'text-white'
  }
};

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
        ${config.bgColor} ${config.textColor}
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
