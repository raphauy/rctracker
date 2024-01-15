"use client"

import { useEffect, useState } from "react";
import { ArrowLeftRight, ChevronsLeft, ChevronsRight, Loader, PackagePlus, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DeliverableForm, DeleteDeliverableForm } from "./deliverable-forms"
import { getDeliverableDAOAction } from "./deliverable-actions"

import { getComplentaryTasksAction, setTasksAction } from "./deliverable-actions"
import { TaskDAO } from "@/services/task-services"  
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
  
type Props= {
  id?: string
  projectId: string
  create?: boolean
  disabled?: boolean
}


export function DeliverableDialog({ id, projectId, disabled }: Props) {
  const [open, setOpen] = useState(false);

  const addTrigger= (
    <div className={cn(!disabled && "hover:bg-accent hover:text-accent-foreground rounded-md", "p-2 flex items-center gap-2")} >
      <PlusCircle className={cn("h-5 w-5", disabled && "text-gray-300")} />Add Deliverable
    </div>
  )
  
  const updateTrigger= (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn(!disabled && "hover:bg-accent hover:text-accent-foreground rounded-md", "p-2", disabled && "cursor-default")} >
          <Pencil className={cn("h-5 w-5", disabled && "text-gray-300")} />
        </div>
      </TooltipTrigger>
      {!disabled && <TooltipContent>Edit Deliverable</TooltipContent>}
    </Tooltip>
  )
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {id ? updateTrigger : addTrigger }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? 'Update' : 'Create'} Deliverable
          </DialogTitle>
        </DialogHeader>
        <DeliverableForm closeDialog={() => setOpen(false)} id={id} projectId={projectId} />
      </DialogContent>
    </Dialog>
  )
}
  
type DeleteProps= {
  id: string
  description: string
  disabled?: boolean
}

export function DeleteDeliverableDialog({ id, description, disabled }: DeleteProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn(!disabled && "hover:bg-accent hover:text-accent-foreground rounded-md", "p-2", disabled && "cursor-default")} >
              <Trash2 className={cn("h-5 w-5", disabled && "text-gray-300 cursor-default")} />
            </div>
          </TooltipTrigger>
          {!disabled && <TooltipContent>Delete Deliverable</TooltipContent>}
        </Tooltip>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Deliverable</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <DeleteDeliverableForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}

interface CollectionProps{
  id: string
  title: string
}

    
export function TasksDialog({ id, title }: CollectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ArrowLeftRight className="hover:cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DeliverableTasksBox closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  );
}      




interface TasksBoxProps{
  id: string
  closeDialog: () => void
}

export function DeliverableTasksBox({ id, closeDialog }: TasksBoxProps) {

  const [loading, setLoading] = useState(false)
  const [tasks, setTasks] = useState<TaskDAO[]>([])
  const [complementary, setComplementary] = useState<TaskDAO[]>([])

  useEffect(() => {
      getDeliverableDAOAction(id)
      .then((data) => {
          if(!data) return null
          if (!data.tasks) return null
          console.log(data.tasks)            
          setTasks(data.tasks)
      })
      getComplentaryTasksAction(id)
      .then((data) => {
          if(!data) return null
          setComplementary(data)
      })
  }, [id])

  function complementaryIn(id: string) {
      const comp= complementary.find((c) => c.id === id)
      if(!comp) return
      const newComplementary= complementary.filter((c) => c.id !== id)
      setComplementary(newComplementary)
      setTasks([...tasks, comp])
  }

  function complementaryOut(id: string) {            
      const comp= tasks.find((c) => c.id === id)
      if(!comp) return
      const newComplementary= tasks.filter((c) => c.id !== id)
      setTasks(newComplementary)
      setComplementary([...complementary, comp])
  }

  function allIn() {
      setTasks([...tasks, ...complementary])
      setComplementary([])
  }

  function allOut() {
      setComplementary([...complementary, ...tasks])
      setTasks([])
  }

  async function handleSave() {
      setLoading(true)
      setTasksAction(id, tasks)
      .then(() => {
          toast({ title: "Tasks updated" })
          closeDialog()
      })
      .catch((error) => {
          toast({ title: "Error updating tasks" })
      })
      .finally(() => {
          setLoading(false)
      })
  }

  return (
      <div>
          <div className="grid grid-cols-2 gap-4 p-3 border rounded-md min-w-[400px] min-h-[300px]">
              <div className="flex flex-col border-r">
              {
                  tasks.map((item) => {
                  return (
                      <div key={item.id} className="flex items-center justify-between gap-2 mb-1 mr-5">
                          <p className="whitespace-nowrap">{item.title}</p>
                          <Button variant="secondary" className="h-7" onClick={() => complementaryOut(item.id)}><ChevronsRight /></Button>
                      </div>
                  )})
              }
                      <div className="flex items-end justify-between flex-1 gap-2 mb-1 mr-5">
                          <p>Todos</p>
                          <Button variant="secondary" className="h-7" onClick={() => allOut()}><ChevronsRight /></Button>
                      </div>
              </div>
              <div className="flex flex-col">
              {
                  complementary.map((item) => {
                  return (
                      <div key={item.id} className="flex items-center gap-2 mb-1">
                          <Button variant="secondary" className="h-7 x-7" onClick={() => complementaryIn(item.id)}>
                              <ChevronsLeft />
                          </Button>
                          <p className="whitespace-nowrap">{item.title}</p>
                      </div>
                  )})
              }
                  <div className="flex items-end flex-1 gap-2 mb-1">
                      <Button variant="secondary" className="h-7" onClick={() => allIn()}><ChevronsLeft /></Button>
                      <p>Todos</p>
                  </div>
              </div>
          </div>

          <div className="flex justify-end mt-4">
              <Button type="button" variant={"secondary"} className="w-32" onClick={() => closeDialog()}>Cancelar</Button>
              <Button onClick={handleSave} className="w-32 ml-2" >{loading ? <Loader className="animate-spin" /> : <p>Save</p>}</Button>
          </div>
      </div>
  )
} 
  
