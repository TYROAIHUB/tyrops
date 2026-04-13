import { useState, useEffect } from "react"
import { BaseLayout } from "@/components/layout/BaseLayout"
import { Button } from "@/components/ui/button"
import { Plus, LayoutList, LayoutGrid } from "lucide-react"
import useStore from "@/store/useStore"
import { seedProjects } from "@/data/seedData"

import { StatCards } from "./components/stat-cards"
import { DataTable } from "./components/data-table"
import { ProjectCards } from "./components/project-cards"
import { ProjectFormSheet } from "./components/project-form-sheet"
import { ProjectDetailSheet } from "./components/project-detail-sheet"
import { ProjectVariablesSheet } from "./components/project-variables-sheet"

export default function ProjectsPage() {
  const projects = useStore((s) => s.projects)
  const addProject = useStore((s) => s.addProject)
  const updateProject = useStore((s) => s.updateProject)
  const deleteProject = useStore((s) => s.deleteProject)
  const dedupeProjects = useStore((s) => s.dedupeProjects)

  const [view, setView] = useState("list")
  const [formOpen, setFormOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [varsOpen, setVarsOpen] = useState(false)
  const [varsProject, setVarsProject] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)
  const [editProject, setEditProject] = useState(null)

  // Auto-seed on first load if projects are empty, then dedupe by name (keep newest)
  useEffect(() => {
    if (projects.length === 0) {
      seedProjects.forEach((p) => addProject(p))
    } else {
      dedupeProjects()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleNewProject = () => {
    setEditProject(null)
    setFormOpen(true)
  }

  const handleViewProject = (project) => {
    setSelectedProject(project)
    setDetailOpen(true)
  }

  const handleEditProject = (project) => {
    setEditProject(project)
    setFormOpen(true)
  }

  const handleDeleteProject = (id) => {
    deleteProject(id)
    setDetailOpen(false)
  }

  const handleOpenVariables = (project) => {
    setVarsProject(project)
    setVarsOpen(true)
  }

  const handleFormSubmit = (data, id) => {
    if (id) {
      updateProject(id, data)
    } else {
      addProject(data)
    }
  }

  return (
    <BaseLayout>
      <div className="flex flex-col gap-4">
        {/* Stat Cards */}
        <div className="px-4 lg:px-6">
          <StatCards projects={projects} />
        </div>

        {/* Content */}
        <div className="px-4 lg:px-6 mt-4">
          <DataTable
            view={view}
            onViewChange={setView}
            onNewProject={handleNewProject}
            projects={projects}
            onViewProject={handleViewProject}
            onEditProject={handleEditProject}
            onDeleteProject={handleDeleteProject}
            onOpenVariables={handleOpenVariables}
          />
          {view === "card" && (
            <div className="mt-4">
              <ProjectCards
                projects={projects}
                onViewProject={handleViewProject}
              />
            </div>
          )}
        </div>
      </div>

      {/* Form Sheet (Create / Edit) */}
      <ProjectFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        project={editProject}
        onSubmit={handleFormSubmit}
        projects={projects}
      />

      {/* Detail Sheet */}
      <ProjectDetailSheet
        open={detailOpen}
        onOpenChange={setDetailOpen}
        project={selectedProject}
        projects={projects}
        onEdit={handleEditProject}
        onDelete={handleDeleteProject}
      />

      {/* Variables Sheet */}
      <ProjectVariablesSheet
        open={varsOpen}
        onOpenChange={setVarsOpen}
        project={varsProject ? projects.find((p) => p.id === varsProject.id) || varsProject : null}
      />
    </BaseLayout>
  )
}
