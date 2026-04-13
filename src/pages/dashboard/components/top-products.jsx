import { Eye, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useStore } from "@/store/useStore"
import { useNavigate } from "react-router-dom"
import { useT } from "@/i18n"

const statusColors = {
  active: "text-green-600 border-green-200",
  completed: "text-blue-600 border-blue-200",
  planned: "text-orange-600 border-orange-200",
  hold: "text-red-600 border-red-200",
}

export function TopProducts() {
  const t = useT()
  const projects = useStore((s) => s.projects)
  const navigate = useNavigate()

  const topProjects = [...projects]
    .sort((a, b) => (b.valueGenerated || 0) - (a.valueGenerated || 0))
    .slice(0, 5)

  const maxRevenue = topProjects[0]?.valueGenerated || 1

  return (
    <Card className="cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>{t('topProjects.title')}</CardTitle>
          <CardDescription>{t('topProjects.description')}</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => navigate("/app/projects")}>
          <Eye className="h-4 w-4 mr-2" />
          {t('action.viewAll')}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {topProjects.map((project, index) => (
          <div key={project.id} className="flex items-center p-3 rounded-lg border gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
              #{index + 1}
            </div>
            <div className="flex gap-2 items-center justify-between space-x-3 flex-1 flex-wrap">
              <div>
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium truncate">{project.name}</p>
                  <Badge variant="outline" className="text-xs">{project.type}</Badge>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-muted-foreground">{(project.tech || project.stack || []).slice(0, 3).join(", ")}</span>
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">${(project.valueGenerated || 0).toLocaleString()}</p>
                  <Badge variant="outline" className={`cursor-pointer ${statusColors[project.status] || ""}`}>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {project.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">
                    Cost: ${(project.costSpent || 0).toLocaleString()}
                  </span>
                  <Progress
                    value={((project.valueGenerated || 0) / maxRevenue) * 100}
                    className="w-12 h-1"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
