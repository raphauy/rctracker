"use client"

import { useEffect, useState } from "react";
import { ArrowLeftRight, ChevronsLeft, ChevronsRight, Loader, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DevelopmentForm, DeleteDevelopmentForm } from "./development-forms"
import { getDevelopmentDAOAction } from "./development-actions"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DevelopmentDAO } from "@/services/development-services";
import { Badge } from "@/components/ui/badge";

type Props= {
  id?: string
  taskId: string | null
  disabled?: boolean
}

export function DevelopmentDialog({ id, taskId, disabled }: Props) {
  const [open, setOpen] = useState(false);

  const addTrigger= (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn(!disabled && "hover:bg-accent hover:text-accent-foreground p-2 rounded-md")} >
          <PlusCircle className="h-5 w-5" />
        </div>
      </TooltipTrigger>
      {!disabled && <TooltipContent>Add Development</TooltipContent>}
    </Tooltip>
  )
  
  const updateTrigger= (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="hover:bg-accent hover:text-accent-foreground p-2 rounded-md">
          <Pencil className="h-5 w-5" />
        </div>
      </TooltipTrigger>
      <TooltipContent>Edit development</TooltipContent>
    </Tooltip>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger disabled={disabled}>
        {id ? updateTrigger : addTrigger }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? 'Update' : 'Create'} Development
          </DialogTitle>
        </DialogHeader>
        <DevelopmentForm closeDialog={() => setOpen(false)} id={id} taskId={taskId} />
      </DialogContent>
    </Dialog>
  )
}

type TitleProps= {
  development: DevelopmentDAO
  disabled?: boolean
}

export function TitleDevelopmentDialog({ development, disabled }: TitleProps) {
  const [open, setOpen] = useState(false);

  const dateStr= format(development.date, "PP", { locale: es })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className={cn("p-1 flex gap-5 w-44 justify-between", !disabled && "hover:bg-accent hover:text-accent-foreground rounded-md", disabled && "cursor-default")} >
          <p className="whitespace-nowrap">{dateStr}:</p>
          <Badge variant="green">{development.actualHours}h</Badge>

        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{'Update Development'} Development
          </DialogTitle>
        </DialogHeader>
        <DevelopmentForm closeDialog={() => setOpen(false)} id={development.id} taskId={development.taskId} />
      </DialogContent>
    </Dialog>
  )
}


type DeleteProps= {
  id: string
  description: string
  disabled?: boolean
}

export function DeleteDevelopmentDialog({ id, description, disabled }: DeleteProps) {
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
          {!disabled && <TooltipContent>Delete development</TooltipContent>}
        </Tooltip>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Development</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <DeleteDevelopmentForm closeDialog={() => setOpen(false)} id={id} taskId={null} />
      </DialogContent>
    </Dialog>
  )
}

interface CollectionProps{
  id: string
  title: string
}




  
