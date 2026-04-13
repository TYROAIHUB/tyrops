import { useEffect, useState, useRef } from "react"
import { useT } from "@/i18n"
import useStore from "@/store/useStore"
import { useForm } from "react-hook-form"
import { useScrollFade } from "@/hooks/use-scroll-fade"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Copy, Check, CalendarIcon, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TypeIcon } from "./type-icon"
import { StatusBadge, StatusDot } from "./status-badge"
import { StatefulButton } from "@/components/ui/stateful-button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { TeamMultiSelect } from "./team-multi-select"
import { TechMultiSelect } from "./tech-multi-select"
import { RelatedProjectsSelect } from "./related-projects-select"

const projectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().default(""),
  status: z.enum(["planned", "active", "completed", "hold"]),
  type: z.string().min(1, "Type is required"),
  tech: z.array(z.string()).default([]),
  team: z.array(z.string()).default([]),
  repo: z.string().optional().default(""),
  liveUrl: z.string().optional().default(""),
  startDate: z.string().optional().default(""),
  endDate: z.string().optional().default(""),
  // İstatistikler — Kullanım
  activeUsers: z.coerce.number().min(0).default(0),
  totalInteractions: z.coerce.number().min(0).default(0),
  totalRuntime: z.coerce.number().min(0).default(0),
  // İstatistikler — Kazanç
  savedTime: z.coerce.number().min(0).default(0),
  valueGenerated: z.coerce.number().min(0).default(0),
  replacedCost: z.coerce.number().min(0).default(0),
  // İstatistikler — Maliyet
  costSpent: z.coerce.number().min(0).default(0),
  monthlyRecurring: z.coerce.number().min(0).default(0),
  relatedProjects: z.array(z.string()).default([]),
  notes: z.string().optional().default(""),
})

const DEFAULT_VALUES = {
  name: "",
  description: "",
  status: "planned",
  type: "web-app",
  tech: [],
  team: [],
  repo: "",
  liveUrl: "",
  startDate: new Date().toISOString().split("T")[0],
  endDate: "",
  activeUsers: 0,
  totalInteractions: 0,
  totalRuntime: 0,
  savedTime: 0,
  valueGenerated: 0,
  replacedCost: 0,
  costSpent: 0,
  monthlyRecurring: 0,
  relatedProjects: [],
  notes: "",
}

function DateRangePicker({ startDate, endDate, onStartChange, onEndChange, placeholder }) {
  const [open, setOpen] = useState(false)
  const language = useStore((s) => s.language)
  const loc = language === 'TR' ? 'tr-TR' : 'en-US'

  const parseDate = (str) => str ? new Date(str + 'T00:00:00') : undefined
  const formatDate = (str) => str
    ? new Date(str + 'T00:00:00').toLocaleDateString(loc, { day: 'numeric', month: 'short', year: 'numeric' })
    : null

  const selected = { from: parseDate(startDate), to: parseDate(endDate) }

  const handleSelect = (range) => {
    onStartChange(range?.from ? range.from.toISOString().split('T')[0] : '')
    onEndChange(range?.to ? range.to.toISOString().split('T')[0] : '')
    if (range?.to) setOpen(false)
  }

  const label = startDate
    ? endDate
      ? `${formatDate(startDate)} – ${formatDate(endDate)}`
      : `${formatDate(startDate)} →`
    : null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start gap-2 font-normal text-xs"
        >
          <CalendarIcon className="size-3.5 shrink-0 text-muted-foreground" />
          <span className={label ? '' : 'text-muted-foreground'}>{label ?? placeholder}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={selected}
          onSelect={handleSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}

function SectionHeading({ label }) {
  const language = useStore((s) => s.language)
  const loc = language === 'TR' ? 'tr-TR' : 'en-US'
  return (
    <div className="flex items-center gap-2 pt-3 pb-0.5">
      <span className="text-[10px] font-semibold tracking-widest text-muted-foreground">
        {label.toLocaleUpperCase(loc)}
      </span>
      <div className="flex-1 h-px bg-border" />
    </div>
  )
}

function CurrencyInput({ field }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
      <Input type="number" min="0" className="pl-6" {...field} />
    </div>
  )
}

function NumberInput({ field, suffix }) {
  return (
    <div className="relative">
      <Input type="number" min="0" className={suffix ? "pr-10" : ""} {...field} />
      {suffix && (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
          {suffix}
        </span>
      )}
    </div>
  )
}

function StatsSubLabel({ label }) {
  return (
    <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/80 pl-0.5 pt-1">
      {label}
    </div>
  )
}

function RepoCopyInput({ field, placeholder }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (!field.value) return
    navigator.clipboard.writeText(field.value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="relative">
      <Input placeholder={placeholder || "https://github.com/..."} {...field} className="pr-9" />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleCopy}
        disabled={!field.value}
        className="absolute right-0 top-0 h-full w-9 cursor-pointer text-muted-foreground hover:text-foreground"
      >
        {copied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />}
      </Button>
    </div>
  )
}

export function ProjectFormSheet({ open, onOpenChange, project, onSubmit, projects = [] }) {
  const t = useT()
  const isEdit = !!project
  const scrollRef = useRef(null)
  const showFade = useScrollFade(scrollRef)

  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (project) {
      form.reset({
        name: project.name || "",
        description: project.description || "",
        status: project.status || "planned",
        type: project.type || "web-app",
        tech: project.tech || [...(project.stack || []), ...(project.aiPlatforms || [])],
        team: project.team || [],
        repo: project.repo || "",
        liveUrl: project.liveUrl || "",
        startDate: project.startDate || "",
        endDate: project.endDate || "",
        activeUsers: project.activeUsers || 0,
        totalInteractions: project.totalInteractions || 0,
        totalRuntime: project.totalRuntime || 0,
        savedTime: project.savedTime || 0,
        valueGenerated: project.valueGenerated || 0,
        replacedCost: project.replacedCost || 0,
        costSpent: project.costSpent || 0,
        monthlyRecurring: project.monthlyRecurring || 0,
        relatedProjects: project.relatedProjects || [],
        notes: project.notes || "",
      })
    } else {
      form.reset(DEFAULT_VALUES)
    }
  }, [project, form])

  const handleSubmit = (data) => {
    const parsed = {
      ...data,
      tech: data.tech || [],
      team: data.team || [],
      endDate: data.endDate || null,
    }
    onSubmit(parsed, project?.id)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="data-[side=right]:sm:max-w-2xl w-full p-0 flex flex-col">
        <SheetHeader className="px-6 py-3.5 pr-12 border-b shrink-0 flex-row items-center gap-3 space-y-0 bg-gradient-to-b from-primary/5 to-background">
          {isEdit ? (
            <div className="size-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <TypeIcon type={form.watch('type')} size={18} />
            </div>
          ) : (
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Plus className="size-4 text-primary" />
            </div>
          )}
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <SheetTitle className="text-sm font-semibold truncate min-w-0">
              {isEdit ? (project?.name || t('form.editTitle')) : t('form.newTitle')}
            </SheetTitle>
            {isEdit && <StatusBadge status={form.watch('status')} />}
            <SheetDescription className="sr-only">
              {isEdit ? t('form.editDesc') : t('form.newDesc')}
            </SheetDescription>
          </div>
        </SheetHeader>

        <div className="relative flex-1 min-h-0">
          <div ref={scrollRef} className="overflow-y-auto h-full px-6 py-4 pb-8">
            <Form {...form}>
              <form id="project-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">

                {/* ── Genel Bilgiler ── */}
                <SectionHeading label={t('form.sectionBasics')} />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.name')}</FormLabel>
                      <FormControl><Input placeholder={t('form.namePlaceholder')} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.description')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('form.descPlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('form.status')}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="cursor-pointer w-full">
                              <SelectValue placeholder={t('form.selectStatus')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {["planned", "active", "completed", "hold"].map((s) => (
                              <SelectItem key={s} value={s}>
                                <span className="inline-flex items-center gap-2">
                                  <StatusDot status={s} />
                                  <span>{t(`status.${s}`)}</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('form.type')}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="cursor-pointer w-full">
                              <SelectValue placeholder={t('form.selectType')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {["web-app", "mobile-app", "api", "automation", "agent", "mcp", "data-pipeline", "other"].map((tp) => (
                              <SelectItem key={tp} value={tp}>
                                <span className="inline-flex items-center gap-2">
                                  <TypeIcon type={tp} size={14} />
                                  <span>{t(`type.${tp}`)}</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium leading-none">{t('form.dateRange')}</label>
                    <DateRangePicker
                      startDate={form.watch('startDate')}
                      endDate={form.watch('endDate')}
                      onStartChange={(v) => form.setValue('startDate', v, { shouldDirty: true })}
                      onEndChange={(v) => form.setValue('endDate', v, { shouldDirty: true })}
                      placeholder={t('form.dateRangePlaceholder')}
                    />
                  </div>
                </div>

                {/* ── Teknoloji & Ekip ── */}
                <SectionHeading label={t('form.sectionTechTeam')} />

                <FormField
                  control={form.control}
                  name="tech"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.tech')}</FormLabel>
                      <FormControl>
                        <TechMultiSelect value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="team"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.team')}</FormLabel>
                      <FormControl>
                        <TeamMultiSelect value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ── Bağlantılar ── */}
                <SectionHeading label={t('form.sectionLinks')} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="repo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('form.repo')}</FormLabel>
                        <FormControl>
                          <RepoCopyInput field={field} placeholder={t('form.repoPlaceholder')} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="liveUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('form.liveUrl')}</FormLabel>
                        <FormControl>
                          <RepoCopyInput field={field} placeholder={t('form.liveUrlPlaceholder')} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* ── İstatistikler ── */}
                <SectionHeading label={t('form.sectionStats')} />

                {/* Alt grup: Kullanım */}
                <StatsSubLabel label={t('form.subStatsUsage')} />
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="activeUsers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('form.activeUsers')}</FormLabel>
                        <FormControl><NumberInput field={field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="totalInteractions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('form.totalInteractions')}</FormLabel>
                        <FormControl><NumberInput field={field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="totalRuntime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('form.totalRuntime')}</FormLabel>
                        <FormControl><NumberInput field={field} suffix="h" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Alt grup: Kazanç */}
                <StatsSubLabel label={t('form.subStatsValue')} />
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="savedTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('form.savedTime')}</FormLabel>
                        <FormControl><NumberInput field={field} suffix="h" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="valueGenerated"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('form.valueGen')}</FormLabel>
                        <FormControl><CurrencyInput field={field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="replacedCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('form.replacedCost')}</FormLabel>
                        <FormControl><CurrencyInput field={field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Alt grup: Maliyet */}
                <StatsSubLabel label={t('form.subStatsCost')} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="costSpent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('form.costSpent')}</FormLabel>
                        <FormControl><CurrencyInput field={field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="monthlyRecurring"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('form.monthlyCost')}</FormLabel>
                        <FormControl><CurrencyInput field={field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* ── Ek Bilgiler ── */}
                <SectionHeading label={t('form.sectionExtra')} />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.notes')}</FormLabel>
                      <FormControl>
                        <Textarea placeholder={t('form.notesPlaceholder')} rows={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="relatedProjects"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.related')}</FormLabel>
                      <FormControl>
                        <RelatedProjectsSelect
                          value={field.value}
                          onChange={field.onChange}
                          projects={projects}
                          currentProjectId={project?.id}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </form>
            </Form>
          </div>

          {/* Bottom fade gradient */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-popover to-transparent transition-opacity duration-200"
            style={{ opacity: showFade ? 1 : 0 }}
          />
        </div>

        <SheetFooter className="px-6 py-4 border-t shrink-0 flex-row justify-end gap-2">
          <StatefulButton variant="outline" onClick={() => onOpenChange(false)}>{t('form.cancel')}</StatefulButton>
          <StatefulButton type="submit" form="project-form">
            {isEdit ? t('form.update') : t('form.create')}
          </StatefulButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
