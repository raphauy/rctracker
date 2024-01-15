"use client"

import { Button } from "@/components/ui/button"
import { DevelopmentDAO } from "@/services/development-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { DeleteDevelopmentDialog, DevelopmentDialog } from "./development-dialogs"
import { TooltipProvider } from "@/components/ui/tooltip"


export const columns: ColumnDef<DevelopmentDAO>[] = [
  
  {
    accessorKey: "comments",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Comments
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "actualHours",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            ActualHours
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "date",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Date
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
		cell: ({ row }) => {
      const data= row.original
      const date= data.date && format(new Date(data.date), "yyyy-MM-dd")
      return (<p>{date}</p>)
    }
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

      const deleteDescription= `Do you want to delete Development ${data.id}?`
 
      return (
        <div className="flex items-center justify-end gap-2">
          <TooltipProvider delayDuration={0}>
          <DevelopmentDialog id={data.id} taskId={data.taskId} />
          <DeleteDevelopmentDialog description={deleteDescription} id={data.id} />
          </TooltipProvider>
        </div>

      )
    },
  },
]


