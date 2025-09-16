import { Outlet, Link, useLocation } from 'react-router'
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
import { Book, FileText, PlusCircle, Calendar } from 'lucide-react'
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
                      isActive={location.pathname === '/posts'}
                  >
                    <Link to="/posts">
                      <FileText className='h-4 w-4' />
                      <span>My Posts</span>
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
                      <span>Research</span>
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
              {/* Mobile Sidebar Toggle */}
              <SidebarTrigger className="lg:hidden" />

              {/* User Profile */}
              <div className="ml-auto">
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
