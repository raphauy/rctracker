import { ClientForm } from "../client-forms";

export default function CreatePage() {
  return (
    <div className="max-w-2xl">
        <div className="text-2xl text-center font-bold mt-5">Add Client</div>

        <ClientForm />
    </div>
  )
}
