import { getNotFinishedProjects } from "@/services/project-services"
import { TaskList } from "./task-list"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

type Props = {
  params: {
    slug: string
  }
}

export default async function PendinsPage({ params }: Props) {
  const slug = params.slug
  const projects= await getNotFinishedProjects(slug)
  console.log(projects)  
  return (
    <div className="w-full my-5 max-w-4xl">
      <p className="font-bold mb-10 text-center text-3xl">Pending tasks</p>
      {
        projects.map((project) => {
          const totalTasks = project.deliverables.reduce((acc, deliverable) => acc + deliverable.tasks.length, 0)
          if (totalTasks === 0) return null
          return (
            <div key={project.id} className="p-4 bg-gray-100 rounded-lg mb-24">
              <p className="text-3xl font-bold">{project.name}</p>
              {
                project.deliverables.map((deliverable) => {
                  if (deliverable.tasks.length === 0) return null

                  return (
                    <div key={deliverable.id} className="p-4 bg-white rounded-lg mt-4">
                      <Link target="_blank" rel="noopener noreferrer"
                        href={`/${slug}?p=${deliverable.projectId}&d=${deliverable.id}`}
                        className="text-xl font-bold mb-5 flex items-center gap-2"
                      >
                        {deliverable.name} <ExternalLink size={20} />
                      </Link>
                      <TaskList tasks={deliverable.tasks} />
                    </div>
                )})
              }
            </div>
        )})
      }
    </div>
  )
}
