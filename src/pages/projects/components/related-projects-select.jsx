import { useState } from "react"
import { useT } from "@/i18n"
import { Check, ChevronsUpDown, X, FolderKanban } from "lucide-react"
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

const avatarColors = [
  "bg-blue-500", "bg-purple-500", "bg-green-500", "bg-orange-500",
  "bg-pink-500", "bg-cyan-500", "bg-yellow-500", "bg-red-500",
]

function getColor(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

function getInitials(name) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()
}

export function RelatedProjectsSelect({ value = [], onChange, projects = [], currentProjectId }) {
  const t = useT()
  const [open, setOpen] = useState(false)

  // Exclude current project from the list
  const available = projects.filter((p) => p.id !== currentProjectId)

  const toggle = (id) => {
    onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id])
  }

  const remove = (id, e) => {
    e.stopPropagation()
    onChange(value.filter((x) => x !== id))
  }

  const getProjectName = (id) => {
    const p = projects.find((pr) => pr.id === id)
    return p?.name || id
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
              <span className="text-muted-foreground text-sm">{t('select.relatedPlaceholder')}</span>
            ) : (
              value.map((id) => {
                const name = getProjectName(id)
                return (
                  <Badge key={id} variant="secondary" className="gap-1 text-xs pr-1">
                    <FolderKanban className="size-3" />
                    {name}
                    <span
                      role="button"
                      aria-label="Remove"
                      onMouseDown={(e) => remove(id, e)}
                      className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5 cursor-pointer inline-flex items-center"
                    >
                      <X className="size-2.5" />
                    </span>
                  </Badge>
                )
              })
            )}
          </div>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Command className="!h-auto">
          <CommandInput placeholder={t('select.relatedSearch')} />
          <CommandList
            style={{ maxHeight: '220px', overflowY: 'auto' }}
            onWheel={(e) => {
              e.stopPropagation()
              e.currentTarget.scrollTop += e.deltaY
            }}
          >
            <CommandEmpty>{t('select.relatedEmpty')}</CommandEmpty>
            <CommandGroup>
              {available.map((project) => {
                const selected = value.includes(project.id)
                const color = getColor(project.name)
                return (
                  <CommandItem
                    key={project.id}
                    value={`${project.name} ${project.type || ""}`}
                    onSelect={() => toggle(project.id)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <div className={`h-6 w-6 rounded-md flex items-center justify-center text-white text-[9px] font-bold shrink-0 ${color}`}>
                        {getInitials(project.name)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm leading-tight truncate">{project.name}</span>
                        {project.type && (
                          <span className="text-xs text-muted-foreground">{project.type}</span>
                        )}
                      </div>
                    </div>
                    <Check className={cn("ml-auto size-4 shrink-0", selected ? "opacity-100" : "opacity-0")} />
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
