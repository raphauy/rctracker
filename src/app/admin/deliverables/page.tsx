import { getDeliverablesDAO } from "@/services/deliverable-services"
import { DeliverableDialog } from "./deliverable-dialogs"
import { DataTable } from "./deliverable-table"
import { columns } from "./deliverable-columns"

export default async function UsersPage() {
  
  const data= await getDeliverablesDAO()

  return (
    <div className="w-full">      

      <div className="container p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="Deliverable"/>      
      </div>
    </div>
  )
}
  
