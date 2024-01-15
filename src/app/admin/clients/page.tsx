import { getClientsDAO } from "@/services/client-services"
import { ClientDialog } from "./client-dialogs"
import { DataTable } from "./client-table"
import { columns } from "./client-columns"

export default async function UsersPage() {
  
  const data= await getClientsDAO()

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <ClientDialog />
      </div>

      <div className="container p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="Client"/>      
      </div>
    </div>
  )
}
  
