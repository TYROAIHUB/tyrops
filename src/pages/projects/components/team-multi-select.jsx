import { useState } from "react"
import { useT } from "@/i18n"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { useStore } from "@/store/useStore"
import fallbackUsersData from "@/pages/users/data.json"

function toSelectUser(u) {
  return {
    value: u.name,
    label: u.name,
    avatar: u.avatar ?? u.name?.slice(0, 2).toUpperCase(),
    role: u.role,
  }
}

export function TeamMultiSelect({ value = [], onChange }) {
  const t = useT()
  const [open, setOpen] = useState(false)
  const storeUsers = useStore((s) => s.users)
  const ALL_USERS = (storeUsers.length > 0 ? storeUsers : fallbackUsersData).map(toSelectUser)

  const toggle = (userName) => {
    if (value.includes(userName)) {
      onChange(value.filter((v) => v !== userName))
    } else {
      onChange([...value, userName])
    }
  }

  const remove = (userName, e) => {
    e.stopPropagation()
    onChange(value.filter((v) => v !== userName))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full min-h-9 h-auto justify-between px-3 py-1.5 cursor-pointer font-normal"
        >
          <div className="flex flex-wrap gap-1 flex-1 text-left">
            {value.length === 0 ? (
              <span className="text-muted-foreground text-sm">{t('select.teamPlaceholder')}</span>
            ) : (
              value.map((name) => (
                <Badge
                  key={name}
                  variant="secondary"
                  className="gap-1 text-xs pr-1"
                >
                  {name}
                  <span
                    role="button"
                    aria-label="Remove"
                    onMouseDown={(e) => remove(name, e)}
                    className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5 cursor-pointer inline-flex items-center"
                  >
                    <X className="size-2.5" />
                  </span>
                </Badge>
              ))
            )}
          </div>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command className="!h-auto">
          <CommandInput placeholder={t('select.teamSearch')} />
          <CommandList
            style={{ maxHeight: '288px', overflowY: 'auto' }}
            onWheel={(e) => {
              e.stopPropagation()
              e.currentTarget.scrollTop += e.deltaY
            }}
          >
            <CommandEmpty>{t('select.teamEmpty')}</CommandEmpty>
            <CommandGroup>
              {ALL_USERS.map((user) => {
                const selected = value.includes(user.value)
                return (
                  <CommandItem
                    key={user.value}
                    value={user.value}
                    onSelect={() => toggle(user.value)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold shrink-0">
                        {user.avatar}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium">{user.label}</span>
                        <span className="text-xs text-muted-foreground">{user.role}</span>
                      </div>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto size-4",
                        selected ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
