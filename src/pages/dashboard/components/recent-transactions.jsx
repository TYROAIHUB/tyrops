import { Eye, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useStore } from "@/store/useStore"
import { useNavigate } from "react-router-dom"
import { getTypeConfig, HugeiconsIcon } from "@/data/type-icons"
import { useT } from "@/i18n"

export function RecentTransactions() {
  const t = useT()
  const projects = useStore((s) => s.projects)
  const navigate = useNavigate()

  function formatDate(dateStr) {
    if (!dateStr) return "—"
    const d = new Date(dateStr)
    const now = new Date()
    const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24))
    if (diff === 0) return t('recent.today')
    if (diff === 1) return t('recent.yesterday')
    if (diff < 7) return t('recent.daysAgo', diff)
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.createdAt || b.startDate || 0) - new Date(a.createdAt || a.startDate || 0))
    .slice(0, 5)

  return (
    <Card className="cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>{t('recent.title')}</CardTitle>
          <CardDescription>{t('recent.description')}</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => navigate("/app/projects")}>
          <Eye className="h-4 w-4 mr-2" />
          {t('action.viewAll')}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentProjects.map((project) => (
          <div key={project.id}>
            <div className="flex p-3 rounded-lg border gap-2">
              {(() => {
                const cfg = getTypeConfig(project.type)
                return (
                  <HugeiconsIcon
                    icon={cfg.icon}
                    style={{ width: 20, height: 20, color: cfg.color }}
                    className="shrink-0 mt-1"
                  />
                )
              })()}
              <div className="flex flex-1 items-center flex-wrap justify-between gap-1">
                <div className="flex items-center space-x-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{project.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{project.type} · {(project.tech || project.stack || []).slice(0, 3).join(", ")}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge
                    variant={
                      project.status === "active" ? "default" :
                      project.status === "completed" ? "secondary" : "outline"
                    }
                    className="cursor-pointer"
                  >
                    {project.status}
                  </Badge>
                  <div className="text-right">
                    <p className="text-sm font-medium">${(project.valueGenerated || 0).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(project.createdAt || project.startDate)}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 cursor-pointer">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="cursor-pointer">{t('action.viewDetails')}</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">{t('action.edit')}</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">{t('action.viewRepo')}</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
