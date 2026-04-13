import { useNavigate } from "react-router-dom"
import { useT } from "@/i18n"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ChevronsUpDownIcon, LogOutIcon, User, Palette } from "lucide-react"

export function NavUser({ user, onOpenThemeCustomizer }) {
  const t = useT()
  const { isMobile } = useSidebar()
  const navigate = useNavigate()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 bg-primary">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="!bg-transparent text-primary-foreground font-bold text-xs">
                  {user.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 bg-primary">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="!bg-transparent text-primary-foreground font-bold text-xs">
                    {user.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
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
              <LogOutIcon className="size-4 mr-2" />
              {t('user.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default NavUser
