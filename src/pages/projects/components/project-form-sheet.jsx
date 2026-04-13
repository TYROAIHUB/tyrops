import { useEffect, useState, useRef } from "react"
import { useT } from "@/i18n"
import { useForm } from "react-hook-form"
import { useScrollFade } from "@/hooks/use-scroll-fade"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Copy, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
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
  startDate: z.string().optional().default(""),
  endDate: z.string().optional().default(""),
  costSpent: z.coerce.number().min(0).default(0),
  monthlyRecurring: z.coerce.number().min(0).default(0),
  valueGenerated: z.coerce.number().min(0).default(0),
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
  startDate: new Date().toISOString().split("T")[0],
  endDate: "",
  costSpent: 0,
  monthlyRecurring: 0,
  valueGenerated: 0,
  relatedProjects: [],
  notes: "",
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
        startDate: project.startDate || "",
        endDate: project.endDate || "",
        costSpent: project.costSpent || 0,
        monthlyRecurring: project.monthlyRecurring || 0,
        valueGenerated: project.valueGenerated || 0,
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
      <SheetContent side="right" className="data-[side=right]:sm:max-w-3xl w-full p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b shrink-0">
          <SheetTitle>{isEdit ? t('form.editTitle') : t('form.newTitle')}</SheetTitle>
          <SheetDescription>
            {isEdit ? t('form.editDesc') : t('form.newDesc')}
          </SheetDescription>
        </SheetHeader>

        <div className="relative flex-1 min-h-0">
          <div ref={scrollRef} className="overflow-y-auto h-full px-6 py-5 pb-8">
            <Form {...form}>
              <form id="project-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">

                {/* Name */}
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

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.description')}</FormLabel>
                      <FormControl>
                        <Textarea placeholder={t('form.descPlaceholder')} rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Status + Type */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('form.status')}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="cursor-pointer">
                              <SelectValue placeholder={t('form.selectStatus')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="planned">{t('status.planned')}</SelectItem>
                            <SelectItem value="active">{t('status.active')}</SelectItem>
                            <SelectItem value="completed">{t('status.completed')}</SelectItem>
                            <SelectItem value="hold">{t('status.hold')}</SelectItem>
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
                            <SelectTrigger className="cursor-pointer">
                              <SelectValue placeholder={t('form.selectType')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="web-app">{t('type.web-app')}</SelectItem>
                            <SelectItem value="mobile-app">{t('type.mobile-app')}</SelectItem>
                            <SelectItem value="api">{t('type.api')}</SelectItem>
                            <SelectItem value="automation">{t('type.automation')}</SelectItem>
                            <SelectItem value="agent">{t('type.agent')}</SelectItem>
                            <SelectItem value="mcp">{t('type.mcp')}</SelectItem>
                            <SelectItem value="data-pipeline">{t('type.data-pipeline')}</SelectItem>
                            <SelectItem value="other">{t('type.other')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Tech */}
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

                {/* Team */}
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

                {/* Repo URL */}
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

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('form.startDate')}</FormLabel>
                        <FormControl><Input type="date" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('form.endDate')}</FormLabel>
                        <FormControl><Input type="date" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Costs */}
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="costSpent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('form.costSpent')}</FormLabel>
                        <FormControl><Input type="number" min="0" {...field} /></FormControl>
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
                        <FormControl><Input type="number" min="0" {...field} /></FormControl>
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
                        <FormControl><Input type="number" min="0" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Notes */}
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

                {/* Related Projects */}
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
