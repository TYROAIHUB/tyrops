import * as React from "react"

const STORAGE_KEY = "tyro-sidebar-config"

const defaultConfig = {
  variant: "inset",
  collapsible: "offcanvas",
  side: "left",
}

function loadConfig() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...defaultConfig, ...JSON.parse(saved) } : defaultConfig
  } catch {
    return defaultConfig
  }
}

export const SidebarContext = React.createContext(null)

export function SidebarConfigProvider({ children }) {
  const [config, setConfig] = React.useState(loadConfig)

  const updateConfig = React.useCallback((newConfig) => {
    setConfig((prev) => {
      const next = { ...prev, ...newConfig }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  return (
    <SidebarContext.Provider value={{ config, updateConfig }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebarConfig() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebarConfig must be used within a SidebarConfigProvider")
  }
  return context
}
