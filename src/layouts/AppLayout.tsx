import { Outlet, Link, useLocation, useNavigate } from 'react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger
} from '@/components/ui/sidebar'
import { Book, FileText, PlusCircle, Calendar, Mic } from 'lucide-react'
import { Linkedin } from 'lucide-react'
import { UserButton, useUser, useAuth } from '@clerk/react-router'
import trilioLogo from '@/lib/logo/trilio-logo.png'
import ConnectLinkedInButton from '@/components/linkedin/ConnectLinkedInButton'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { checkSubscriptionStatus, selectSubscription } from '@/features/subscription/subscriptionSlice'
import { subscriptionService } from '@/features/subscription/subscriptionService'
import { toast } from 'sonner'

export default function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useUser()
  const { getToken } = useAuth()
  const dispatch = useAppDispatch()
  const { isSubscribed } = useAppSelector(selectSubscription)
  const [isUpgrading, setIsUpgrading] = useState(false)

  // Check if LinkedIn is connected via Clerk external accounts
  const hasLinkedIn = user?.externalAccounts?.some(
    account => account.provider === 'linkedin_oidc'
  ) || false

  // Check subscription status on mount
  useEffect(() => {
    const checkStatus = async () => {
      const token = await getToken()
      if (token) {
        dispatch(checkSubscriptionStatus(token))
      }
    }
    checkStatus()
  }, [getToken, dispatch])

  // Clean up Clerk modal state from URL after OAuth
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.has('__clerk_modal_state')) {
      params.delete('__clerk_modal_state')
      const newSearch = params.toString()
      const newUrl = `${location.pathname}${newSearch ? `?${newSearch}` : ''}`
      navigate(newUrl, { replace: true })
    }
  }, [location.search, location.pathname, navigate])

  const handleStartFreeTrial = async () => {
    setIsUpgrading(true)
    try {
      const token = await getToken()
      if (!token) {
        toast.error('Authentication required', { position: 'top-right' })
        setIsUpgrading(false)
        return
      }

      const { url } = await subscriptionService.createCheckoutSession(
        {
          price_id: 'price_1SJXBVGqPFkjWQieNgHLbhD4',
          success_url: `${window.location.origin}/payment-success`,
          cancel_url: window.location.href,
        },
        token
      )

      window.location.href = url
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Failed to start checkout', { position: 'top-right' })
      setIsUpgrading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <SidebarProvider>
        <Sidebar>
            <SidebarHeader>
              <Link to="/" className="flex items-center justify-start p-4">
                <img 
                  src={trilioLogo} 
                  alt="Trilio" 
                  className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity"
                />
              </Link>
            </SidebarHeader>

            <div className="px-6 pb-4">
              <Link to="/dashboard" className='w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2.5 rounded-lg transition-colors'>
                  <PlusCircle className='h-4 w-4' />
                  <span className="font-medium">Create Post</span>
              </Link>
            </div>

            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                      asChild
                      isActive={location.pathname === '/research'}
                  >
                    <Link to="/research">
                      <Book className='h-4 w-4' />
                      <span>Trend Analyzer</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                      asChild
                      isActive={location.pathname === '/voice'}
                  >
                    <Link to="/voice" className="flex items-center gap-2 pointer-events-none">
                      <Mic className='h-4 w-4' />
                      <span>Voice</span>
                      <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                        Coming Soon
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                      asChild
                      isActive={location.pathname === '/posts'}
                  >
                    <Link to="/posts">
                      <FileText className='h-4 w-4' />
                      <span>Drafts</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                      asChild
                      isActive={location.pathname === '/scheduler'}
                  >
                    <Link to="/scheduler">
                      <Calendar className='h-4 w-4' />
                      <span>Scheduler</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
        </Sidebar>
        
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Top Navigation Bar */}
          <header className="border-b border-border bg-background flex-shrink-0">
            <div className="flex items-center justify-between px-6 py-3">
              {/* Sidebar Toggle */}
              <SidebarTrigger />

              {/* LinkedIn Connection Status & User Profile */}
              <div className="ml-auto flex items-center gap-3">
                {/* Start Free Trial Button - Only show if not subscribed */}
                {!isSubscribed && (
                  <button
                    onClick={handleStartFreeTrial}
                    disabled={isUpgrading}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    {isUpgrading ? 'Loading...' : 'Start Free Trial'}
                  </button>
                )}

                {hasLinkedIn ? (
                  <button
                    onClick={() => window.open('https://www.linkedin.com/in/me', '_blank')}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Go to LinkedIn"
                  >
                    <Linkedin className="w-4 h-4 text-gray-600" />
                  </button>
                ) : (
                  <ConnectLinkedInButton size="sm" variant="outline" />
                )}
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                />
              </div>
            </div>
          </header>
          
          {/* Page Content */}
          <div className="flex-1 overflow-hidden">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </div>
  )
}
