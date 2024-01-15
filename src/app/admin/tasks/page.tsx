import { getTasksDAO } from "@/services/task-services"
import { TaskDialog } from "./task-dialogs"
import { DataTable } from "./task-table"
import { columns } from "./task-columns"

export default async function UsersPage() {
  
  const data= await getTasksDAO()

  return (
    <div className="w-full">      

      <div className="container mt-5 p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="Task"/>      
      </div>
    </div>
  )
}
  
