import { getDevelopmentsDAO } from "@/services/development-services"
import { DevelopmentDialog } from "./development-dialogs"
import { DataTable } from "./development-table"
import { columns } from "./development-columns"
import { TooltipProvider } from "@/components/ui/tooltip"

export default async function UsersPage() {
  
  const data= await getDevelopmentsDAO()

  return (
    <div className="w-full">      

      <div className="container p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="Development"/>      
      </div>
    </div>
  )
}
  
