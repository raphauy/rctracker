"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { PlusCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { DeliverableDialog } from "@/app/admin/deliverables/deliverable-dialogs"
import { ProjectDialog } from "@/app/admin/projects/project-dialogs"
import { getClientDAOBySlugAction } from "@/app/admin/clients/client-actions"

interface ProjectSwitcherProps {
  isAdmin?: boolean
  isCollapsed: boolean
  projects: {
    label: string
    id: string
    icon: React.ReactNode
  }[]
}

export function ProjectSwitcher({ isAdmin, isCollapsed, projects }: ProjectSwitcherProps) {

  const [selectedProject, setSelectedProject] = React.useState<string>(projects.length > 0 ? projects[0].id : "")
  const [clientId, setClientId] = React.useState("")
  const router = useRouter()
  const searchParams= useSearchParams()
  const params= useParams()

  React.useEffect(() => {
    const projectId= searchParams.get("p")

    const slug= params.slug as string
    if (slug) {
      getClientDAOBySlugAction(slug)
      .then((client) => {
        if (!client) {
          return
        }
        setClientId(client.id)
      })
      .catch((error) => {
        console.error(error)
      })
    }

    if (projectId) {
      setSelectedProject(projectId)
    } else if (projects.length > 0) {
      setSelectedProject(projects[0].id)
    }

  }, [params.slug, projects, searchParams])

  function handleProjectChange(projectId: string) {
    const slug= params.slug
    setSelectedProject(projectId)
    router.push(`/${slug}?p=${projectId}`)
  }

  return (
    <Select defaultValue={selectedProject} onValueChange={handleProjectChange}>
      <SelectTrigger
        className={cn(
          "flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
          isCollapsed &&
            "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden"
        )}
        aria-label="Select project"
      >
        <SelectValue placeholder="Select an project">
          {projects.find((account) => account.id === selectedProject)?.icon}
          <span className={cn("ml-2", isCollapsed && "hidden")}>
            {
              projects.find((account) => account.id === selectedProject)?.label
            }
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {projects.map((project) => (
          <SelectItem key={project.id} value={project.id}>
            <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
              {project.icon}
              {project.label}
            </div>
          </SelectItem>
        ))}
        {
          isAdmin && (
            <>            
              <Separator />
              <ProjectDialog clientId={clientId} />
            </>
          )
        }
      </SelectContent>
    </Select>
  )
}
