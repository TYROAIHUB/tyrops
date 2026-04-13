import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { FolderPlus, Bot, Workflow } from "lucide-react"
import { useT } from "@/i18n"

export function QuickActions() {
  const t = useT()
  const navigate = useNavigate()

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate("/app/projects")}
      >
        <FolderPlus className="h-4 w-4 mr-2" />
        {t('dashboard.newProject')}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate("/app/projects")}
      >
        <Bot className="h-4 w-4 mr-2" />
        {t('dashboard.deployAgent')}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate("/app/projects")}
      >
        <Workflow className="h-4 w-4 mr-2" />
        {t('dashboard.createAuto')}
      </Button>
    </div>
  )
}
