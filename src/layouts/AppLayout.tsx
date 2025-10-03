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
import { UserButton, useUser } from '@clerk/react-router'
import trilioLogo from '@/lib/logo/trilio-logo.png'
import ConnectLinkedInButton from '@/components/linkedin/ConnectLinkedInButton'
import { useEffect } from 'react'

export default function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isLoaded } = useUser()

  console.log('[AppLayout] Current URL:', window.location.href)
  console.log('[AppLayout] Search params:', location.search)
  console.log('[AppLayout] User loaded:', isLoaded)
  console.log('[AppLayout] User object:', user)
  console.log('[AppLayout] External accounts:', user?.externalAccounts)

  // Check if LinkedIn is connected via Clerk external accounts
  const hasLinkedIn = user?.externalAccounts?.some(
    account => account.provider === 'linkedin_oidc'
  ) || false

  console.log('[AppLayout] LinkedIn connected:', hasLinkedIn)

  // Clean up Clerk modal state from URL after OAuth
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.has('__clerk_modal_state')) {
      console.log('[AppLayout] Detected Clerk modal state in URL, cleaning up...')
      console.log('[AppLayout] Clerk modal state:', params.get('__clerk_modal_state'))

      // Remove the clerk modal state parameter
      params.delete('__clerk_modal_state')

      // Replace the URL without the parameter
      const newSearch = params.toString()
      const newUrl = `${location.pathname}${newSearch ? `?${newSearch}` : ''}`

      console.log('[AppLayout] Navigating to clean URL:', newUrl)
      navigate(newUrl, { replace: true })
    }
  }, [location.search, location.pathname, navigate])

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
                      isActive={location.pathname === '/voice'}
                  >
                    <Link to="/voice">
                      <Mic className='h-4 w-4' />
                      <span>Voice</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

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
                {hasLinkedIn ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg border border-green-200">
                    <Linkedin className="w-4 h-4" />
                    <span className="text-sm font-medium">LinkedIn Connected</span>
                  </div>
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
