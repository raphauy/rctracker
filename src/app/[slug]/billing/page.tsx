import { filterProjects } from "@/services/project-services";
import { Billing } from "./billing";
import { getCurrentUser } from "@/lib/auth";

type Props = {
  params: {
    slug: string
  }
}
export default async function CostsPage({ params }: Props) {
  const { slug } = params

  return (
    <div className="mt-10 w-full max-w-4xl">
      <p className="font-bold text-center text-3xl">Billing</p>
      <Billing slug={slug} />
    </div>
  )
}
