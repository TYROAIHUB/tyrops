import * as React from "react"
import useStore from "@/store/useStore"
import { useT } from "@/i18n"
import { Link } from "react-router-dom"
import { NavMain } from "@/components/layout/NavMain"
import { NavUser } from "@/components/layout/NavUser"
import { TyroLogo } from "@/components/ui/tyro-logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import Home01Icon from "@hugeicons/core-free-icons/Home01Icon"
import Folder02Icon from "@hugeicons/core-free-icons/Folder02Icon"
import BubbleChatIcon from "@hugeicons/core-free-icons/BubbleChatIcon"
import Calendar03Icon from "@hugeicons/core-free-icons/Calendar03Icon"
import UserGroupIcon from "@hugeicons/core-free-icons/UserGroupIcon"
import Settings02Icon from "@hugeicons/core-free-icons/Settings02Icon"
import HelpCircleIcon from "@hugeicons/core-free-icons/HelpCircleIcon"
import PaintBoardIcon from "@hugeicons/core-free-icons/PaintBoardIcon"

// Wrap HugeIcons to work like Lucide icons (accept className etc.)
const hi = (icon) => (props) => <HugeiconsIcon icon={icon} {...props} />

const DashboardIcon = hi(Home01Icon)
const ProjectsIcon = hi(Folder02Icon)
const ChatIcon = hi(BubbleChatIcon)
const CalendarIcon = hi(Calendar03Icon)
const UsersIcon = hi(UserGroupIcon)
const SettingsIcon = hi(Settings02Icon)
const FaqsIcon = hi(HelpCircleIcon)
const ThemeIcon = hi(PaintBoardIcon)


export function AppSidebar({ onOpenThemeCustomizer, ...props }) {
  const t = useT()
  const userProfile = useStore((s) => s.userProfile)
  const projectCount = useStore((s) => s.projects.length)

  const navGroups = [
    {
      label: t('group.overview'),
      items: [
        { title: t('nav.dashboard'), url: "/app", icon: DashboardIcon },
      ],
    },
    {
      label: t('group.tracking'),
      items: [
        { title: t('nav.projects'), url: "/app/projects", icon: ProjectsIcon },
      ],
    },
    {
      label: t('group.apps'),
      items: [
        { title: t('nav.chat'),     url: "/app/chat",     icon: ChatIcon },
        { title: t('nav.calendar'), url: "/app/calendar", icon: CalendarIcon },
        { title: t('nav.users'),    url: "/app/users",    icon: UsersIcon },
      ],
    },
    {
      label: t('group.pages'),
      items: [
        {
          title: t('nav.settings'),
          url: "#",
          icon: SettingsIcon,
          items: [
            { title: t('nav.settings.user'),          url: "/app/settings/user" },
            { title: t('nav.settings.account'),       url: "/app/settings/account" },
            { title: t('nav.settings.appearance'),    url: "/app/settings/appearance" },
            { title: t('nav.settings.notifications'), url: "/app/settings/notifications" },
            { title: t('nav.settings.connections'),   url: "/app/settings/connections" },
            { title: t('nav.settings.pricing'),       url: "/app/settings/pricing" },
          ],
        },
        { title: t('nav.faqs'), url: "/app/faqs", icon: FaqsIcon },
      ],
    },
  ]
  const user = {
    name: `${userProfile.firstName} ${userProfile.lastName}`,
    email: userProfile.email,
    avatar: "",
  }

  const navGroupsWithBadges = navGroups.map((group) => ({
    ...group,
    items: group.items.map((item) =>
      item.url === "/app/projects"
        ? { ...item, badge: projectCount > 0 ? projectCount : null }
        : item
    ),
  }))

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/app">
                <span className="flex aspect-square size-8 items-center justify-center shrink-0">
                  <TyroLogo size={34} />
                </span>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">TYROps</span>
                  <span className="truncate text-xs text-muted-foreground">AI Ops Tracker</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {navGroupsWithBadges.map((group) => (
          <NavMain key={group.label} label={group.label} items={group.items} />
        ))}
      </SidebarContent>
      <SidebarFooter className="px-2 pb-3">
        <div className="bg-white/30 dark:bg-white/5 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]" style={{ borderRadius: 'var(--radius-xl)' }}>
          <NavUser user={user} onOpenThemeCustomizer={onOpenThemeCustomizer} />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
