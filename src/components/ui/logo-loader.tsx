import logoSingle from '@/lib/logo/logo-single.png';
import { cn } from '@/lib/utils';

interface LogoLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
  xl: 'w-32 h-32',
};

export function LogoLoader({
  size = 'lg',
  text,
  className
}: LogoLoaderProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center',
      className
    )}>
      <div className="relative">
        <img
          src={logoSingle}
          alt="Loading"
          className={cn(
            sizeClasses[size],
            'animate-pulse-fade object-contain grayscale opacity-30'
          )}
        />
        <div className="absolute inset-0 bg-gray-300/10 rounded-full blur-xl animate-pulse-fade-delayed" />
      </div>
      {text && (
        <p className="mt-4 text-sm text-gray-500 animate-pulse-fade-delayed">
          {text}
        </p>
      )}
    </div>
  );
}

export default LogoLoader;