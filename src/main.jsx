import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ThemeProvider } from '@/components/ThemeProvider'
import { SidebarConfigProvider } from '@/contexts/SidebarContext'
import './index.css'
import App from './App.jsx'
import NotFound from './components/NotFound.jsx'

// Lazy load all pages
const Dashboard = lazy(() => import('./pages/dashboard/index.jsx'))
const Chat = lazy(() => import('./pages/chat/page.jsx'))
const CalendarPage = lazy(() => import('./pages/calendar/page.jsx'))
const UsersPage = lazy(() => import('./pages/users/page.jsx'))
const ProjectsPage = lazy(() => import('./pages/projects/page.jsx'))
const FAQs = lazy(() => import('./pages/faqs/page.jsx'))

// Settings pages
const UserSettings = lazy(() => import('./pages/settings/user/page.jsx'))
const AccountSettings = lazy(() => import('./pages/settings/account/page.jsx'))
const AppearanceSettings = lazy(() => import('./pages/settings/appearance/page.jsx'))
const NotificationSettings = lazy(() => import('./pages/settings/notifications/page.jsx'))
const ConnectionSettings = lazy(() => import('./pages/settings/connections/page.jsx'))

const LoadingFallback = (
  <div className="flex h-screen items-center justify-center text-muted-foreground">
    Loading...
  </div>
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="tyrox-theme">
      <TooltipProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Suspense fallback={LoadingFallback}>
            <SidebarConfigProvider>
              <Routes>
                {/* Matrix Intro */}
                <Route path="/" element={<App />} />

                {/* Dashboard App */}
                <Route path="/app" element={<Dashboard />} />
                <Route path="/app/chat" element={<Chat />} />
                <Route path="/app/calendar" element={<CalendarPage />} />
                <Route path="/app/users" element={<UsersPage />} />
                <Route path="/app/projects" element={<ProjectsPage />} />
                <Route path="/app/faqs" element={<FAQs />} />

                {/* Settings */}
                <Route path="/app/settings" element={<Navigate to="/app/settings/user" replace />} />
                <Route path="/app/settings/user" element={<UserSettings />} />
                <Route path="/app/settings/account" element={<AccountSettings />} />
                <Route path="/app/settings/appearance" element={<AppearanceSettings />} />
                <Route path="/app/settings/notifications" element={<NotificationSettings />} />
                <Route path="/app/settings/connections" element={<ConnectionSettings />} />

                {/* Exit / 404 */}
                <Route path="/exit" element={<NotFound />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SidebarConfigProvider>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>,
)
