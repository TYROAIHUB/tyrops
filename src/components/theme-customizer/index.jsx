import React from 'react'
import { Layout, Palette, RotateCcw, Settings, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useThemeManager } from '@/hooks/use-theme-manager'
import { useSidebarConfig } from '@/contexts/SidebarContext'
import { ThemeTab } from './theme-tab'
import { LayoutTab } from './layout-tab'
import { ImportModal } from './import-modal'
import { cn } from '@/lib/utils'

export function ThemeCustomizer({ open, onOpenChange }) {
  const { applyImportedTheme, isDarkMode, resetTheme, applyRadius, setBrandColorsValues, applyTheme } = useThemeManager()
  const { config: sidebarConfig, updateConfig: updateSidebarConfig } = useSidebarConfig()

  const [activeTab, setActiveTab] = React.useState("theme")
  const [importModalOpen, setImportModalOpen] = React.useState(false)
  const justOpenedRef = React.useRef(false)

  React.useEffect(() => {
    if (open) {
      justOpenedRef.current = true
      const t = setTimeout(() => { justOpenedRef.current = false }, 400)
      return () => clearTimeout(t)
    }
  }, [open])

  const savedTheme = React.useMemo(() => {
    try { return JSON.parse(localStorage.getItem("tyro-theme-config") || "{}") } catch { return {} }
  }, [])
  const [selectedTheme, setSelectedTheme] = React.useState(savedTheme.selectedTheme || "default")
  const [selectedRadius, setSelectedRadius] = React.useState(savedTheme.selectedRadius || "0.5rem")
  const [importedTheme, setImportedTheme] = React.useState(savedTheme.importedTheme || null)

  React.useEffect(() => {
    try {
      localStorage.setItem("tyro-theme-config", JSON.stringify({
        selectedTheme, selectedRadius, importedTheme,
      }))
    } catch {}
  }, [selectedTheme, selectedRadius, importedTheme])

  const handleReset = () => {
    setSelectedTheme("")
    setSelectedRadius("0.5rem")
    setImportedTheme(null)
    setBrandColorsValues({})
    resetTheme()
    applyRadius("0.5rem")
    updateSidebarConfig({ variant: "inset", collapsible: "offcanvas", side: "left" })
    try { localStorage.removeItem("tyro-theme-config") } catch {}
  }

  const handleImport = (themeData) => {
    setImportedTheme(themeData)
    setSelectedTheme("")
    applyImportedTheme(themeData, isDarkMode)
  }

  React.useEffect(() => {
    if (importedTheme) {
      applyImportedTheme(importedTheme, isDarkMode)
    } else if (selectedTheme) {
      applyTheme(selectedTheme, isDarkMode)
    }
  }, [isDarkMode, importedTheme, selectedTheme, applyImportedTheme, applyTheme])

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
        <SheetContent
          side={sidebarConfig.side === "left" ? "right" : "left"}
          className="w-[400px] p-0 gap-0 pointer-events-auto [&>button]:hidden overflow-hidden flex flex-col"
          onInteractOutside={(e) => {
            if (importModalOpen || justOpenedRef.current) e.preventDefault()
          }}
        >
          <SheetHeader className="space-y-0 p-4 pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Settings className="h-4 w-4" />
              </div>
              <SheetTitle className="text-lg font-semibold">Customizer</SheetTitle>
              <div className="ml-auto flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={handleReset} className="cursor-pointer h-8 w-8">
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => onOpenChange(false)} className="cursor-pointer h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <SheetDescription className="text-sm text-muted-foreground sr-only">
              Customize the theme and layout of your dashboard.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <div className="py-2">
                <TabsList className="grid w-full grid-cols-2 rounded-none h-12 p-1.5">
                  <TabsTrigger value="theme" className="cursor-pointer data-[state=active]:bg-background"><Palette className="h-4 w-4 mr-1" /> Theme</TabsTrigger>
                  <TabsTrigger value="layout" className="cursor-pointer data-[state=active]:bg-background"><Layout className="h-4 w-4 mr-1" /> Layout</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="theme" className="flex-1 mt-0">
                <ThemeTab
                  selectedTheme={selectedTheme}
                  setSelectedTheme={setSelectedTheme}
                  selectedRadius={selectedRadius}
                  setSelectedRadius={setSelectedRadius}
                  setImportedTheme={setImportedTheme}
                  onImportClick={() => setImportModalOpen(true)}
                />
              </TabsContent>

              <TabsContent value="layout" className="flex-1 mt-0">
                <LayoutTab />
              </TabsContent>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>

      <ImportModal
        open={importModalOpen}
        onOpenChange={setImportModalOpen}
        onImport={handleImport}
      />
    </>
  )
}

export function ThemeCustomizerTrigger({ onClick }) {
  const { config: sidebarConfig } = useSidebarConfig()
  return (
    <Button
      onClick={onClick}
      size="icon"
      className={cn(
        "fixed top-1/2 -translate-y-1/2 h-12 w-12 rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer",
        sidebarConfig.side === "left" ? "right-4" : "left-4"
      )}
    >
      <Settings className="h-5 w-5" />
    </Button>
  )
}
