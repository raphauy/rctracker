"use client"

import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { updateTaskStatusAction } from "./task-actions"
import { toast } from "@/components/ui/use-toast"

interface Props {
  id: string
  status: string
  disabled?: boolean
}
export function TaskStatusSelector({ id, status, disabled}: Props) {
  const [node, setNode] = useState<React.ReactNode>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setNode(getNode(status))
  }, [status])
  

  function handleClick(status: string) {
    setLoading(true)
    updateTaskStatusAction(id, status)
    .then((res) => {
      if (res){
        toast({ title: "Estado actualizado"})
        setNode(getNode(status))
      } else toast({ title: "Error al actualizar el estado", variant: "destructive"})
    })
    .catch((err) => {
      toast({ title: "Error al actualizar el estado", variant: "destructive"})
      console.log(err)
    })
    .finally(() => setLoading(false))

  }
  return (
    <Menubar className="p-0 m-0 bg-transparent border-none">
      <MenubarMenu>
        <MenubarTrigger className="p-0 m-0" disabled={disabled}>
          {node}
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => handleClick("Pending")}>
            {getNode("Pending")}
          </MenubarItem>
          <MenubarItem onClick={() => handleClick("Active")}>
            {getNode("Active")}
          </MenubarItem>
          <MenubarItem onClick={() => handleClick("Finished")}>
            {getNode("Finished")}
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

export function getNode(status: string) {
  const lightColor= getPostStatusColor(status, "0.3")
  const darkColor= getPostStatusColor(status)

  const res= (
    <div className={cn("flex w-28 justify-center text-gray-700 font-bold items-center h-6 gap-1 rounded-2xl cursor-pointer")} style={{ backgroundColor: lightColor }}>
      <p className={cn("w-2 h-2 rounded-full")} style={{ backgroundColor: darkColor }}></p>
      <p>{status}</p>
    </div>
  )  
  return res
}


export function getPostStatusColor(status: string, opacity?: string) {
  switch (status) {
    case "Pending":
      return `rgba(255, 140, 0, ${opacity || 1})`; // orange
    case "Active":
      return `rgba(0, 128, 0, ${opacity || 1})`; // green
    case "Finished":
      return `rgba(51, 153, 255, ${opacity || 1})`; // sky
    default:
      return `rgba(156, 163, 175, ${opacity || 1})`; // gray
    }
}
  