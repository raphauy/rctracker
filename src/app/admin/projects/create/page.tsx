import { getClientDAOBySlug } from "@/services/client-services";
import { ProjectForm } from "../project-forms";

type Props = {
  searchParams: {
    slug: string
  }
}
export default async function CreatePage({ searchParams }: Props) {
  const slug= searchParams.slug
  if (!slug) {
    return <div>Slug not found</div>
  }

  const client= await getClientDAOBySlug(slug)

  return (
    <div className="max-w-2xl">
        <div className="text-2xl text-center font-bold mt-5">Add Project</div>

        <ProjectForm clientId={client.id} />
    </div>
  )
}
