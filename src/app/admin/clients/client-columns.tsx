"use client"

import { Button } from "@/components/ui/button"
import { ClientDAO } from "@/services/client-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { DeleteClientDialog, ClientDialog } from "./client-dialogs"

import { UsersDialog } from "./client-dialogs"
  

export const columns: ColumnDef<ClientDAO>[] = [
  
  {
    accessorKey: "name",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Name
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },
  // {
  //   accessorKey: "role",
  //   header: ({ column }) => {
  //     return (
  //       <Button variant="ghost" className="pl-0 dark:text-white"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
  //         Rol
  //         <ArrowUpDown className="w-4 h-4 ml-1" />
  //       </Button>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  // },
  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const deleteDescription= `Do you want to delete Client ${data.id}?`
 
      return (
        <div className="flex items-center justify-end gap-2">

          <UsersDialog id={data.id} title={"Users"} />
  
          <ClientDialog id={data.id} />
          <DeleteClientDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


