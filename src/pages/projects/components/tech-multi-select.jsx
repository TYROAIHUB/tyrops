import React, { useState } from "react"
import { useT } from "@/i18n"
import { Icon } from "@iconify/react"
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
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { TECH_ALL_GROUPS, getTechItem } from "@/data/tech-all"

// Official Microsoft Dataverse SVG — source: github.com/microsoft/PowerBI-Icons
function DataverseIcon({ size = 14 }) {
  return (
    <svg viewBox="0 0 2049.1001 1571.027" width={size} height={size} fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="m 2049.1,639 q 0,123 -29,239 -29,116 -83,220 -54,104 -131,191 -77,87 -174,149 -97,62 -211,98 -114,36 -242,35 -68,0 -136,-12 -68,-12 -132,-35 -64,-23 -123,-58 -59,-35 -109,-82 -22,38 -53,69 -31,31 -69,52 -38,21 -80,33 -42,12 -86,12 -78,0 -137,-29 -59,-29 -102,-77 -43,-48 -73,-111 -30,-63 -46,-132 -16,-69 -25,-138 -9,-69 -8,-132 0,-123 29,-239 29,-116 83,-220 54,-104 131,-190 77,-86 175,-149 98,-63 211,-98 113,-35 242,-35 67,0 135,11 68,11 132,35 64,24 123,59 59,35 109,81 22,-38 53,-69 31,-31 69,-52 38,-21 80,-33 42,-12 87,-12 78,0 137,28 59,28 102,77 43,49 73,112 30,63 46,132 16,69 24,138 8,69 8,132 z m -1658,783 q 74,0 119,-38 45,-38 78,-99 -62,-81 -95,-177 -33,-96 -33,-199 0,-95 31,-189 31,-94 90,-168 59,-74 142,-121 83,-47 186,-47 85,0 170,28 85,28 153,80 68,52 110,126 42,74 43,168 0,54 -15,106 -15,52 -48,96 34,-30 60,-68 26,-38 44,-80 18,-42 27,-87 9,-45 9,-91 0,-79 -23,-149 -23,-70 -64,-130 -41,-60 -97,-107 -56,-47 -122,-81 -66,-34 -139,-50 -73,-16 -148,-18 -110,0 -207,30 -97,30 -179,85 -82,55 -148,130 -66,75 -112,165 -46,90 -70,190 -24,100 -25,205 0,41 4,93 4,52 15,106 11,54 30,107 19,53 48,93 29,40 70,66 41,26 96,25 z m 1530,-784 q 0,-41 -4,-93 -4,-52 -15,-106 -11,-54 -30,-107 -19,-53 -48,-93 -29,-40 -69,-66 -40,-26 -96,-25 -74,0 -119,38 -45,38 -79,99 62,81 95,177 33,96 34,200 0,63 -14,126 -14,63 -42,122 -28,59 -66,109 -38,50 -90,87 -52,37 -110,59 -58,22 -128,21 -85,0 -170,-28 -85,-28 -153,-80 -68,-52 -110,-126 -42,-74 -43,-167 0,-55 17,-106 17,-51 46,-97 -34,30 -60,68 -26,38 -44,80 -18,42 -27,88 -9,46 -9,91 0,79 23,149 23,70 64,130 41,60 97,107 56,47 122,80 66,33 139,50 73,17 148,18 110,0 207,-30 97,-30 180,-85 83,-55 148,-130 65,-75 111,-164 46,-89 70,-190 24,-101 25,-206 z" />
    </svg>
  )
}

function TechIcon({ item, size = 15 }) {
  if (item.imgUrl) return <img src={item.imgUrl} alt={item.label} width={size} height={size} className="object-contain" />
  if (item.icon === "__dataverse__") return <DataverseIcon size={size} />
  if (item.icon) return <Icon icon={item.icon} width={size} height={size} style={item.color ? { color: item.color } : {}} />
  return (
    <span className="font-bold leading-none text-white" style={{ fontSize: size * 0.55 }}>
      {(item.abbr ?? item.label.slice(0, 2)).toUpperCase()}
    </span>
  )
}

export function TechMultiSelect({ value = [], onChange }) {
  const t = useT()
  const [open, setOpen] = useState(false)

  const toggle = (v) => {
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v])
  }

  const remove = (v, e) => {
    e.stopPropagation()
    onChange(value.filter((x) => x !== v))
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
              <span className="text-muted-foreground text-sm">{t('select.techPlaceholder')}</span>
            ) : (
              value.map((v) => {
                const item = getTechItem(v)
                return (
                  <Badge key={v} variant="secondary" className="gap-1.5 text-xs pr-1 pl-1.5">
                    <span
                      className="h-3.5 w-3.5 rounded-sm flex items-center justify-center shrink-0 overflow-hidden"
                      style={{ backgroundColor: item.bg, border: "1px solid #e5e7eb" }}
                    >
                      <TechIcon item={item} size={10} />
                    </span>
                    {item.label}
                    <span
                      role="button"
                      aria-label="Remove"
                      onMouseDown={(e) => remove(v, e)}
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
          <CommandInput placeholder={t('select.techSearch')} />
          <CommandList
            style={{ maxHeight: '288px', overflowY: 'auto' }}
            onWheel={(e) => {
              e.stopPropagation()
              e.currentTarget.scrollTop += e.deltaY
            }}
          >
            <CommandEmpty>{t('select.techEmpty')}</CommandEmpty>
            {TECH_ALL_GROUPS.map((group, gi) => (
              <React.Fragment key={group.group}>
                {gi > 0 && <CommandSeparator />}
                <CommandGroup heading={group.group}>
                  {group.items.map((item) => {
                    const selected = value.includes(item.value)
                    return (
                      <CommandItem
                        key={item.value}
                        value={`${group.group} ${item.value} ${item.label} ${item.desc ?? ""}`}
                        onSelect={() => toggle(item.value)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <div
                            className="h-6 w-6 rounded flex items-center justify-center shrink-0"
                            style={{ backgroundColor: item.bg, border: "1px solid #e5e7eb" }}
                          >
                            <TechIcon item={item} size={15} />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm leading-tight">{item.label}</span>
                            {item.desc && (
                              <span className="text-xs text-muted-foreground">{item.desc}</span>
                            )}
                          </div>
                        </div>
                        <Check className={cn("ml-auto size-4 shrink-0", selected ? "opacity-100" : "opacity-0")} />
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </React.Fragment>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
