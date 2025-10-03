import { Button } from '@/components/ui/button'
import { Linkedin } from 'lucide-react'
import { useClerk } from '@clerk/react-router'

interface ConnectLinkedInButtonProps {
  className?: string
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  onSuccess?: () => void
  children?: React.ReactNode
}

export default function ConnectLinkedInButton({
  className,
  variant = 'default',
  size = 'default',
  children
}: ConnectLinkedInButtonProps) {
  const { openUserProfile } = useClerk()

  const handleConnect = () => {
    openUserProfile()
  }

  return (
    <Button
      onClick={handleConnect}
      className={className}
      variant={variant}
      size={size}
    >
      <Linkedin className="mr-2 h-4 w-4" />
      {children || 'Connect LinkedIn'}
    </Button>
  )
}