import { Link } from 'react-router-dom';
import trilioLogo from '@/lib/logo/trilio-logo.png'

export default function OnboardingTopNav() {
  return (
    <nav className="bg-background px-6 py-6">
      <div className="flex items-center">
        {/* Logo on the left */}
        <Link to="/">
          <img 
            src={trilioLogo} 
            alt="Trilio Logo" 
            className="h-12 w-auto object-contain cursor-pointer"
          />
        </Link>
      </div>
    </nav>
  )
}
