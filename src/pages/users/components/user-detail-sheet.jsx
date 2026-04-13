import { useRef } from "react"
import { useScrollFade } from "@/hooks/use-scroll-fade"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Calendar, Mail, CreditCard, Shield, Pencil, Trash2 } from "lucide-react"

const getStatusColor = (status) => {
  switch (status) {
    case "Active": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200"
    case "Pending": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200"
    case "Error": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200"
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200"
  }
}

const getRoleColor = (role) => {
  switch (role) {
    case "Admin": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    case "Editor": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case "Author": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    case "Maintainer": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "Subscriber": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  }
}

const avatarColors = [
  "bg-blue-500", "bg-purple-500", "bg-green-500", "bg-orange-500",
  "bg-pink-500", "bg-cyan-500", "bg-yellow-500", "bg-red-500",
]

function getAvatarColor(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

export function UserDetailSheet({ open, onOpenChange, user, onEdit, onDelete }) {
  const scrollRef = useRef(null)
  const showFade = useScrollFade(scrollRef)

  if (!user) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="data-[side=right]:sm:max-w-3xl w-full p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b shrink-0">
          <div className="flex items-center gap-3">
            <Avatar className={`h-10 w-10 ${getAvatarColor(user.name)}`}>
              <AvatarFallback className="text-sm font-bold text-white bg-transparent">
                {user.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <SheetTitle className="text-lg">{user.name}</SheetTitle>
                <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
              </div>
              <SheetDescription>{user.email}</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="relative flex-1 min-h-0">
          <div ref={scrollRef} className="overflow-y-auto h-full px-6 py-5 pb-8">
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <Shield className="size-3.5" />
                    Role
                  </div>
                  <Badge variant="secondary" className={getRoleColor(user.role)}>{user.role}</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Plan</p>
                  <p className="text-sm font-medium">{user.plan}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <CreditCard className="size-3.5" />
                    Billing
                  </div>
                  <p className="text-sm">{user.billing}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <Mail className="size-3.5" />
                    Email
                  </div>
                  <p className="text-sm">{user.email}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <Calendar className="size-3.5" />
                    Joined Date
                  </div>
                  <p className="text-sm">
                    {user.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <Calendar className="size-3.5" />
                    Last Login
                  </div>
                  <p className="text-sm">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-popover to-transparent transition-opacity duration-200"
            style={{ opacity: showFade ? 1 : 0 }}
          />
        </div>

        <SheetFooter className="px-6 py-4 border-t shrink-0 flex-row justify-end gap-2">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => { onOpenChange(false); onEdit(user) }}
          >
            <Pencil className="size-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            className="cursor-pointer"
            onClick={() => { onOpenChange(false); onDelete(user.id) }}
          >
            <Trash2 className="size-4" />
            Delete
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
