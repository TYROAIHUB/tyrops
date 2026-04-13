import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, DollarSign } from "lucide-react"
import { useT } from "@/i18n"

const formatCurrency = (value) => {
  if (!value) return "$0"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function ProjectCards({ projects, onViewProject }) {
  const t = useT()

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
        return <Badge variant="outline">{t('status.hold')}</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card
          key={project.id}
          className="border cursor-pointer transition-shadow hover:shadow-lg"
          onClick={() => onViewProject(project)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-base leading-tight">
                {project.name}
              </CardTitle>
              {getStatusBadge(project.status)}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.description}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Stack tags */}
            <div className="flex flex-wrap gap-1">
              {(project.stack || []).slice(0, 4).map((tech) => (
                <Badge key={tech} variant="outline" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {(project.stack || []).length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{project.stack.length - 4}
                </Badge>
              )}
            </div>

            {/* Team avatars */}
            <div className="flex items-center gap-1">
              {(project.team || []).slice(0, 4).map((member) => (
                <Avatar key={member} className="h-7 w-7">
                  <AvatarFallback className="text-[10px] font-medium">
                    {member.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
              {(project.team || []).length > 4 && (
                <span className="text-xs text-muted-foreground ml-1">
                  +{project.team.length - 4}
                </span>
              )}
            </div>

            {/* Dates and cost */}
            <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
              <div className="flex items-center gap-1">
                <Calendar className="size-3.5" />
                <span>
                  {project.startDate
                    ? new Date(project.startDate).toLocaleDateString()
                    : "-"}
                </span>
              </div>
              <div className="flex items-center gap-1 font-medium text-foreground">
                <DollarSign className="size-3.5" />
                <span>{formatCurrency(project.valueGenerated)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {projects.length === 0 && (
        <div className="col-span-full text-center py-12 text-muted-foreground">
          {t('projects.empty')}
        </div>
      )}
    </div>
  )
}
