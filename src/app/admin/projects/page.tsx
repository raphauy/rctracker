import { getProjectsDAO } from "@/services/project-services"
import { ProjectDialog } from "./project-dialogs"
import { DataTable } from "./project-table"
import { columns } from "./project-columns"

export default async function UsersPage() {
  
  const data= await getProjectsDAO()

  return (
    <div className="w-full">      

      <div className="container p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="Project"/>      
      </div>
    </div>
  )
}
  
