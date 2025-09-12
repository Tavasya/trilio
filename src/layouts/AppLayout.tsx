import { Outlet, Link, useLocation } from 'react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar'
import { Book, FileText, Home, PlusCircle, Calendar } from 'lucide-react'
import { UserButton } from '@clerk/react-router'
import trilioLogo from '@/lib/logo/trilio-logo.png'

export default function AppLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex">
      <SidebarProvider>
        <Sidebar>
            <SidebarHeader>
              <Link to="/" className="flex items-center justify-start p-4">
                <img 
                  src={trilioLogo} 
                  alt="Trilio" 
                  className="w-10 h-10 cursor-pointer hover:opacity-80 transition-opacity"
                />
              </Link>
            </SidebarHeader>

            <div className="p-4">
              <Link to="/create-post" className='w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md'>
                  <PlusCircle className='h-4 w-4' />
                  <span>Create Post</span>
              </Link>
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
                      isActive={location.pathname === '/scheduler'}
                      className="hover:bg-accent/50 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                  >
                    <Link to="/scheduler">
                      <Calendar className='h-4 w-4' />
                      <span>Scheduler</span>
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
              <div className="flex items-center gap-4">
                {/* Page title or breadcrumbs can go here */}
                <h1 className="text-lg font-semibold">
                  {location.pathname === '/dashboard' && 'Dashboard'}
                  {location.pathname === '/research' && 'Research'}
                  {location.pathname === '/scheduler' && 'Scheduler'}
                  {location.pathname === '/posts' && 'My Posts'}
                  {location.pathname === '/create-post' && 'Create Post'}
                  {location.pathname === '/generate' && 'Generate Post'}
                </h1>
              </div>
              
              {/* User Profile */}
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
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
