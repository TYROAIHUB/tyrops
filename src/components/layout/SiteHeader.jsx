import * as React from "react"
import { useLocation, Link, useNavigate } from "react-router-dom"
import { FolderKanban, Users, LayoutDashboard, MessageCircle, Calendar, Settings, HelpCircle, LogOut, Palette, User } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Icon } from "@iconify/react"

const LANGUAGES = {
  TR: { icon: "circle-flags:tr", label: "TR", next: "EN", title: "Switch to English" },
  EN: { icon: "circle-flags:gb", label: "EN", next: "TR", title: "Türkçeye geç" },
}

function LanguageToggle() {
  const language = useStore((s) => s.language)
  const setLanguage = useStore((s) => s.setLanguage)
  const current = LANGUAGES[language] || LANGUAGES.TR

  return (
    <button
      onClick={() => setLanguage(current.next)}
      className="h-8 w-8 flex items-center justify-center rounded-[var(--radius-xl)] cursor-pointer backdrop-blur-xl bg-white/75 dark:bg-white/10 border border-white/70 dark:border-white/25 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.10),0_1px_4px_rgba(0,0,0,0.07),inset_0_1px_0_rgba(255,255,255,0.85)] transition-all hover:shadow-[0_6px_24px_-2px_rgba(0,0,0,0.14)] select-none"
      title={current.title}
    >
      <Icon icon={current.icon} className="size-5 shrink-0" />
    </button>
  )
}
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { GooeyInput } from "@/components/ui/gooey-input"
import useStore from "@/store/useStore"
import { useT } from "@/i18n"

function UserInfo() {
  const userProfile = useStore((s) => s.userProfile)
  return (
    <>
      <p className="text-sm font-medium">{userProfile.firstName} {userProfile.lastName}</p>
      <p className="text-xs text-muted-foreground">{userProfile.email}</p>
    </>
  )
}
import usersData from "@/pages/users/data.json"

const ROUTE_KEYS = {
  app: "page.app",
  projects: "page.projects",
  chat: "page.chat",
  calendar: "page.calendar",
  users: "page.users",
  settings: "page.settings",
  user: "page.user",
  account: "page.account",
  appearance: "page.appearance",
  notifications: "page.notifications",
  connections: "page.connections",
  faqs: "page.faqs",
}

function useBreadcrumbs() {
  const t = useT()
  const location = useLocation()
  const segments = location.pathname.replace(/^\//, "").split("/").filter(Boolean)
  return segments.map((seg, i) => {
    const key = ROUTE_KEYS[seg]
    const label = key ? t(key) : seg.charAt(0).toUpperCase() + seg.slice(1)
    const href = "/" + segments.slice(0, i + 1).join("/")
    return { label, href }
  })
}

function usePages() {
  const t = useT()
  return [
    { title: t('nav.dashboard'), url: "/app",              icon: LayoutDashboard },
    { title: t('nav.projects'),  url: "/app/projects",     icon: FolderKanban },
    { title: t('nav.chat'),      url: "/app/chat",         icon: MessageCircle },
    { title: t('nav.calendar'),  url: "/app/calendar",     icon: Calendar },
    { title: t('nav.users'),     url: "/app/users",        icon: Users },
    { title: t('nav.settings'),  url: "/app/settings/user",icon: Settings },
    { title: t('nav.faqs'),      url: "/app/faqs",         icon: HelpCircle },
  ]
}

function SearchResultsInner({ query, onSelect }) {
  const t = useT()
  const pages = usePages()
  const projects = useStore((s) => s.projects)
  const navigate = useNavigate()

  if (!query || query.length < 2) return null

  const q = query.toLowerCase()

  const matchedPages = pages.filter((p) => p.title.toLowerCase().includes(q))
  const matchedProjects = projects.filter((p) =>
    [p.name, p.description, p.type, p.status, ...(p.tech || []), ...(p.team || [])]
      .filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
  ).slice(0, 5)
  const matchedUsers = usersData.filter((u) =>
    [u.name, u.email, u.role, u.plan, u.status]
      .filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
  ).slice(0, 5)

  const hasResults = matchedPages.length || matchedProjects.length || matchedUsers.length

  if (!hasResults) {
    return (
      <div className="absolute top-full right-0 mt-2 w-72 rounded-lg border bg-popover p-3 shadow-lg z-50">
        <p className="text-xs text-muted-foreground text-center py-2">{t('search.empty')}</p>
      </div>
    )
  }

  const handleNav = (url) => { navigate(url); onSelect() }

  return (
    <div className="absolute top-full right-0 mt-2 w-80 rounded-lg border bg-popover shadow-lg z-50 max-h-80 overflow-y-auto">
      {matchedPages.length > 0 && (
        <div className="p-2">
          <p className="px-2 py-1 text-xs font-medium text-muted-foreground">{t('search.pages')}</p>
          {matchedPages.map((page) => {
            const Icon = page.icon
            return (
              <button key={page.url} onClick={() => handleNav(page.url)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent cursor-pointer">
                <Icon className="size-4 text-muted-foreground" />
                {page.title}
              </button>
            )
          })}
        </div>
      )}
      {matchedProjects.length > 0 && (
        <div className="border-t p-2">
          <p className="px-2 py-1 text-xs font-medium text-muted-foreground">{t('search.projects')}</p>
          {matchedProjects.map((project) => (
            <button key={project.id} onClick={() => handleNav("/app/projects")}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent cursor-pointer">
              <FolderKanban className="size-4 text-muted-foreground" />
              <div className="flex flex-col items-start min-w-0">
                <span className="truncate">{project.name}</span>
                <span className="text-xs text-muted-foreground truncate">{project.type} · {project.status}</span>
              </div>
            </button>
          ))}
        </div>
      )}
      {matchedUsers.length > 0 && (
        <div className="border-t p-2">
          <p className="px-2 py-1 text-xs font-medium text-muted-foreground">{t('search.users')}</p>
          {matchedUsers.map((user) => (
            <button key={user.id} onClick={() => handleNav("/app/users")}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent cursor-pointer">
              <Users className="size-4 text-muted-foreground" />
              <div className="flex flex-col items-start min-w-0">
                <span className="truncate">{user.name}</span>
                <span className="text-xs text-muted-foreground truncate">{user.role} · {user.email}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
const SearchResults = React.memo(SearchResultsInner)

function UserAvatar({ onOpenThemeCustomizer }) {
  const t = useT()
  const navigate = useNavigate()
  const userProfile = useStore((s) => s.userProfile)
  const initials = `${userProfile.firstName?.[0] ?? ""}${userProfile.lastName?.[0] ?? ""}`.toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="cursor-pointer rounded-full ring-offset-background transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <Avatar className="h-8 w-8 bg-primary">
            <AvatarFallback className="text-xs font-bold text-primary-foreground bg-transparent">{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5">
          <UserInfo />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/app/settings/account")}>
          <User className="size-4 mr-2" />
          {t('user.account')}
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => setTimeout(onOpenThemeCustomizer, 100)}>
          <Palette className="size-4 mr-2" />
          {t('user.theme')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-destructive" onClick={() => navigate("/")}>
          <LogOut className="size-4 mr-2" />
          {t('user.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function SiteHeader({ onOpenThemeCustomizer }) {
  const breadcrumbs = useBreadcrumbs()
  const [searchValue, setSearchValue] = React.useState("")
  const [searchOpen, setSearchOpen] = React.useState(false)

  const handleSearchSelect = React.useCallback(() => {
    setSearchValue("")
    setSearchOpen(false)
  }, [])

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 py-3 lg:gap-2 lg:px-6">
        {/* Left: sidebar trigger + breadcrumb */}
        <SidebarTrigger className="-ml-1 h-8 w-8 [&_svg]:size-4" />
        <div className="mx-2 h-4 w-px shrink-0 self-center bg-border" />

        {breadcrumbs.length > 0 && (
          <Breadcrumb className="hidden sm:block">
            <BreadcrumbList className="text-sm">
              {breadcrumbs.map((crumb, i) => {
                const isLast = i === breadcrumbs.length - 1
                return (
                  <React.Fragment key={crumb.href}>
                    {i > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage className="text-sm font-medium">{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to={crumb.href}>{crumb.label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        )}

        {/* Right: search + notifications + dark mode */}
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <GooeyInput
              placeholder="Search..."
              value={searchValue}
              onValueChange={setSearchValue}
              onOpenChange={setSearchOpen}
            />
            {searchOpen && searchValue && (
              <SearchResults
                query={searchValue}
                onSelect={handleSearchSelect}
              />
            )}
          </div>

          <LanguageToggle />
          <UserAvatar onOpenThemeCustomizer={onOpenThemeCustomizer} />
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
