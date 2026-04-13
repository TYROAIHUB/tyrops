import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Toaster } from '@/components/ui/sonner'
import { Outlet, useLocation } from 'react-router-dom'
import AppSidebar from './AppSidebar'

const breadcrumbMap = {
  '/app': 'Dashboard',
  '/app/projects': 'Projects',
  '/app/agents': 'AI Agents',
  '/app/automations': 'Automations',
  '/app/settings': 'Settings',
}

export default function AppLayout() {
  const location = useLocation()

  const currentPage =
    breadcrumbMap[location.pathname] || location.pathname.split('/').pop() || 'Dashboard'

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>{currentPage}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}
