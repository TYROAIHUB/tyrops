import { useRef } from "react"
import { useT } from "@/i18n"
import { useScrollFade } from "@/hooks/use-scroll-fade"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Calendar,
  GitBranch,
  Database,
  DollarSign,
  Users,
  Pencil,
  Trash2,
  ExternalLink,
} from "lucide-react"

const formatCurrency = (value) => {
  if (!value) return "$0"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const stackColors = [
  "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
  "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
  "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
]

export function ProjectDetailSheet({
  open,
  onOpenChange,
  project,
  onEdit,
  onDelete,
}) {
  const t = useT()
  const scrollRef = useRef(null)
  const showFade = useScrollFade(scrollRef)

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
            {t('status.active')}
          </Badge>
        )
      case "completed":
        return <Badge variant="secondary">{t('status.completed')}</Badge>
      case "planned":
        return <Badge variant="outline">{t('status.planned')}</Badge>
      case "hold":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800">
            {t('status.hold')}
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (!project) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="data-[side=right]:sm:max-w-3xl w-full p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b shrink-0">
          <div className="flex items-center gap-3">
            <SheetTitle className="text-xl">{project.name}</SheetTitle>
            {getStatusBadge(project.status)}
          </div>
          <SheetDescription>{project.description}</SheetDescription>
        </SheetHeader>

        <div className="relative flex-1 min-h-0">
          <div ref={scrollRef} className="overflow-y-auto h-full px-6 py-5 pb-8">
            <div className="space-y-5">
              {/* Type and Database */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{t('detail.type')}</p>
                  <p className="text-sm capitalize">{project.type}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <Database className="size-3.5" />
                    {t('detail.database')}
                  </div>
                  <p className="text-sm">{project.database || t('detail.none')}</p>
                </div>
              </div>

              <Separator />

              {/* Stack */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {t('detail.techStack')}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(project.tech || project.stack || []).map((tech, i) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className={stackColors[i % stackColors.length]}
                    >
                      {tech}
                    </Badge>
                  ))}
                  {(!(project.tech || project.stack) || (project.tech || project.stack).length === 0) && (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </div>
              </div>

              <Separator />

              {/* Team */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                  <Users className="size-3.5" />
                  {t('detail.team')}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(project.team || []).map((member) => (
                    <Badge key={member} variant="outline">
                      {member}
                    </Badge>
                  ))}
                  {(!project.team || project.team.length === 0) && (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </div>
              </div>

              <Separator />

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <Calendar className="size-3.5" />
                    {t('detail.startDate')}
                  </div>
                  <p className="text-sm">
                    {project.startDate
                      ? new Date(project.startDate).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <Calendar className="size-3.5" />
                    {t('detail.endDate')}
                  </div>
                  <p className="text-sm">
                    {project.endDate
                      ? new Date(project.endDate).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>

              {/* Repository */}
              {project.repo && (
                <>
                  <Separator />
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                      <GitBranch className="size-3.5" />
                      {t('detail.repo')}
                    </div>
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                    >
                      {project.repo}
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                </>
              )}

              <Separator />

              {/* Financial */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                  <DollarSign className="size-3.5" />
                  {t('detail.financials')}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg border p-3 space-y-1">
                    <p className="text-xs text-muted-foreground">{t('detail.costSpent')}</p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(project.costSpent)}
                    </p>
                  </div>
                  <div className="rounded-lg border p-3 space-y-1">
                    <p className="text-xs text-muted-foreground">{t('detail.monthly')}</p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(project.monthlyRecurring)}
                    </p>
                  </div>
                  <div className="rounded-lg border p-3 space-y-1">
                    <p className="text-xs text-muted-foreground">{t('detail.valueGen')}</p>
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(project.valueGenerated)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {project.notes && (
                <>
                  <Separator />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('detail.notes')}
                    </p>
                    <p className="text-sm whitespace-pre-wrap">{project.notes}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Bottom fade gradient */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-popover to-transparent transition-opacity duration-200"
            style={{ opacity: showFade ? 1 : 0 }}
          />
        </div>

        <SheetFooter className="px-6 py-4 border-t shrink-0 flex-row justify-end gap-2">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => {
              onOpenChange(false)
              onEdit(project)
            }}
          >
            <Pencil className="size-4" />
            {t('detail.edit')}
          </Button>
          <Button
            variant="destructive"
            className="cursor-pointer"
            onClick={() => {
              onOpenChange(false)
              onDelete(project.id)
            }}
          >
            <Trash2 className="size-4" />
            {t('detail.delete')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
