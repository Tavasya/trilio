import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar'
import { Book, FileText, Home, PlusCircle } from 'lucide-react'

export default function AppLayout() {
  const location = useLocation()

  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen">
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
        </Sidebar>
        
        <main className="flex-1"> 
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
