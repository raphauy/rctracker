import { cookies } from "next/headers"

import { getCurrentUser } from "@/lib/auth"
import { getDeliverablesDAOByProjectId } from "@/services/deliverable-services"
import { getProjectsDAOBySlug } from "@/services/project-services"
import { FolderKanban } from "lucide-react"
import { TaskComponent } from "./components/task"
import { redirect } from "next/navigation"

type Props = {
  searchParams: {
    p: string
    d: string
  }
  params: {
    slug: string
  }
}

export default async function Page({ searchParams, params }: Props) {

  const currentUser= await getCurrentUser()
  if (!currentUser) 
    redirect('/login')

  if (currentUser.role !== 'admin' && currentUser.role !== 'client')
    return <div>Unauthorized</div>

  const slug= params.slug
  if (!slug) {
    return null
  }
  const projects= await getProjectsDAOBySlug(slug)
  const data= projects.map((project) => ({
    label: project.name,
    id: project.id,
    icon: <FolderKanban className="h-4 w-4" />
  }))

  let projectId= searchParams.p
  if (!projectId && projects.length > 0) {
    projectId= projects[0].id
  }
  let isAdmin= false
  if (currentUser?.role === "admin") {
    isAdmin= true
  }
  console.log(currentUser?.name)
  
  const deliverables= projectId ? await getDeliverablesDAOByProjectId(projectId) : []

  let deliverableId= searchParams.d
  if (!deliverableId && deliverables.length > 0) {
    deliverableId= deliverables[0].id
  }

  const layout = cookies().get("react-resizable-panels:layout")
  const collapsed = cookies().get("react-resizable-panels:collapsed")

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined
  

  return (
    <div className="w-full">
      <div className="md:hidden">
        <p>Para esta UI se necesita al menos una pantalla mediana</p>
      </div>
      <div className="hidden flex-col md:flex">
        <TaskComponent
          selectedProject={projectId}
          projects={data}
          deliverables={deliverables}
          defaultLayout={defaultLayout}
          defaultCollapsed={defaultCollapsed}
          navCollapsedSize={4}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  )
}


