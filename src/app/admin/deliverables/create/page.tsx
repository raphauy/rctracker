import { getClientDAOBySlug } from "@/services/client-services";
import { DeliverableForm } from "../deliverable-forms";
import { getProjectDAO } from "@/services/project-services";

type Props = {
  searchParams: {
    slug: string
    p: string
  }
}
export default async function CreatePage({ searchParams }: Props) {
  const slug= searchParams.slug
  if (!slug) {
    return <div>slug not found</div>
  }

  const projectId= searchParams.p
  if (!projectId) {
    return <div>projectId not found</div>
  }

  const client= await getClientDAOBySlug(slug)
  const project= await getProjectDAO(projectId)

  return (
    <div className="max-w-2xl">
        <div className="text-2xl text-center font-bold mt-5">Add Project</div>

        <DeliverableForm projectId={project.id} />
    </div>
  )
}
