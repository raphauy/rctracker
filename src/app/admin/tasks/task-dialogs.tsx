"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteTaskForm, TaskForm } from "./task-forms";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Props= {
  id?: string
  deliverableId: string | null
  disabled?: boolean
}

const addTrigger= (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size="icon">
        <PlusCircle className="h-4 w-4" />
        <span className="sr-only">Add task</span>
      </Button>
    </TooltipTrigger>
    <TooltipContent>Add task</TooltipContent>
  </Tooltip>
)


export function TaskDialog({ id, deliverableId, disabled }: Props) {
  const [open, setOpen] = useState(false);

  const addTrigger= (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn(!disabled && "hover:bg-accent hover:text-accent-foreground rounded-md", "p-2", disabled && "cursor-default")} >
          <PlusCircle className={cn("h-5 w-5", disabled && "text-gray-300")} />
        </div>
      </TooltipTrigger>
      {!disabled && <TooltipContent>Add task</TooltipContent>}
    </Tooltip>
  )
  
  const updateTrigger= (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn(!disabled && "hover:bg-accent hover:text-accent-foreground rounded-md", "p-2", disabled && "cursor-default")} >
          <Pencil className={cn("h-5 w-5", disabled && "text-gray-300")} />
        </div>
      </TooltipTrigger>
      {!disabled && <TooltipContent>Edit task</TooltipContent>}
    </Tooltip>
  )
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {id ? updateTrigger : addTrigger }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? 'Update' : 'Create'} Task
          </DialogTitle>
        </DialogHeader>
        <TaskForm closeDialog={() => setOpen(false)} id={id} deliverableId={deliverableId} />
      </DialogContent>
    </Dialog>
  )
}
  
type DeleteProps= {
  id: string
  description: string
  disabled?: boolean
}

export function DeleteTaskDialog({ id, description, disabled }: DeleteProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn(!disabled && "hover:bg-accent hover:text-accent-foreground rounded-md", "p-2", disabled && "cursor-default")} >
              <Trash2 className={cn("h-5 w-5", disabled && "text-gray-300")} />
            </div>
          </TooltipTrigger>
          {!disabled && <TooltipContent>Delete task</TooltipContent>}
        </Tooltip>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Task</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <DeleteTaskForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}

interface CollectionProps{
  id: string
  title: string
}




  
