import { Outlet, Link, useLocation, useNavigate } from 'react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar'
import { Book, FileText, Home, PlusCircle } from 'lucide-react'
import { SignedIn, SignedOut, UserButton, useClerk, useUser } from '@clerk/react-router'
import { useState, useEffect, useRef } from 'react'

export default function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { signOut, openUserProfile } = useClerk()
  const { user } = useUser()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const handleProfileClick = () => {
    // Show our custom dropdown menu
    setShowUserMenu(!showUserMenu)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  return (
    <div className="min-h-screen flex">
      <SidebarProvider>
        <Sidebar>
            <SidebarHeader>
              <h2 className="text-lg font-semibold">Trilio</h2>
            </SidebarHeader>

            <div className="p-4">
              <button className='w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md'>
                  <PlusCircle className='h-4 w-4' />
                  <span>Create Post</span>
              </button>
            </div>

            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                      asChild
                      isActive={location.pathname === '/dashboard' || location.pathname === '/'}
                      
                  >
                    <Link to="/dashboard">
                      <Home className="h-4 w-4" />
                      <span>Home</span>
                    </ Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton 
                      asChild
                      isActive={location.pathname === '/research'}
                      className="hover:bg-accent/50 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                  >
                    <Link to="/research">
                      <Book className='h-4 w-4' />
                      <span>Research</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton 
                      asChild
                      isActive={location.pathname === '/posts'}
                      className="hover:bg-accent/50 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                  >
                    <Link to="/posts">
                      <FileText className='h-4 w-4' />
                      <span>My Posts</span>
                    </ Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

              </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>
              <SignedIn>
                <div ref={profileRef} className="p-4 relative">
                  {/* Clickable profile area */}
                  <div 
                    onClick={handleProfileClick}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                  >
                    {/* Clerk avatar */}
                    <div className="w-8 h-8 pointer-events-none">
                      <UserButton 
                        appearance={{
                          elements: {
                            avatarBox: "w-8 h-8"
                          }
                        }}
                      />
                    </div>
                    
                    {/* User info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {user?.fullName || user?.firstName || 'User'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.primaryEmailAddress?.emailAddress || 'Account'}
                      </p>
                    </div>
                  </div>

                  {/* User menu dropdown */}
                  {showUserMenu && (
                    <div className="absolute bottom-full left-4 right-4 mb-2 bg-background border border-border rounded-lg shadow-lg z-50 min-w-[200px]">
                      <div className="p-2">
                        <div className="px-3 py-2 text-xs text-muted-foreground border-b border-border mb-1">
                          Account
                        </div>
                        <button
                          onClick={() => {
                            setShowUserMenu(false)
                            if (openUserProfile) {
                              openUserProfile()
                            }
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors"
                        >
                          Manage account
                        </button>
                        <div className="border-t border-border my-1"></div>
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors text-red-600"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </SignedIn>
              <SignedOut>
                <div className="p-4">
                  <div className="text-center text-sm text-muted-foreground">
                    Please sign in to access your profile
                  </div>
                </div>
              </SignedOut>
            </SidebarFooter>
        </Sidebar>
        
        <main className="flex-1"> 
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </div>
  )
}
