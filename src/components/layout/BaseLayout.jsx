import * as React from "react"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { SiteFooter } from "@/components/layout/SiteFooter"
import { ThemeCustomizer } from "@/components/ThemeCustomizer"
import { useSidebarConfig } from "@/hooks/use-sidebar-config"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export function BaseLayout({ children, title, description }) {
  const [themeCustomizerOpen, setThemeCustomizerOpen] = React.useState(false)
  const [entering, setEntering] = React.useState(true)
  const [showOverlay, setShowOverlay] = React.useState(true)
  const { config } = useSidebarConfig()

  React.useEffect(() => {
    // Trigger fade-out after mount
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntering(false))
    })
    return () => cancelAnimationFrame(t)
  }, [])

  const sidebar = (
    <AppSidebar
      variant={config.variant}
      collapsible={config.collapsible}
      side={config.side}
      onOpenThemeCustomizer={() => setThemeCustomizerOpen(true)}
    />
  )

  const content = (
    <SidebarInset>
      <SiteHeader onOpenThemeCustomizer={() => setThemeCustomizerOpen(true)} />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {title && (
              <div className="px-4 lg:px-6">
                <div className="flex flex-col gap-2">
                  <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                  {description && (
                    <p className="text-muted-foreground">{description}</p>
                  )}
                </div>
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
      <SiteFooter />
    </SidebarInset>
  )

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "16rem",
        "--sidebar-width-icon": "3rem",
        "--header-height": "calc(var(--spacing) * 14)",
      }}
      className={config.collapsible === "none" ? "sidebar-none-mode" : ""}
    >
      {config.side === "left" ? (
        <>{sidebar}{content}</>
      ) : (
        <>{content}{sidebar}</>
      )}

      <ThemeCustomizer
        open={themeCustomizerOpen}
        onOpenChange={setThemeCustomizerOpen}
      />

      {/* Entrance overlay: fades from black */}
      {showOverlay && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: '#000',
            opacity: entering ? 1 : 0,
            transition: 'opacity 800ms ease-out',
            pointerEvents: 'none',
          }}
          onTransitionEnd={() => setShowOverlay(false)}
        />
      )}
    </SidebarProvider>
  )
}

export default BaseLayout
