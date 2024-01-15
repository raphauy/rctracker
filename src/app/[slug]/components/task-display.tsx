"use client"

import { setDevelopmentDateAction } from "@/app/admin/developments/development-actions"
import { DeleteDevelopmentDialog, DevelopmentDialog, TitleDevelopmentDialog } from "@/app/admin/developments/development-dialogs"
import { setDateAction } from "@/app/admin/tasks/task-actions"
import { DeleteTaskDialog, TaskDialog } from "@/app/admin/tasks/task-dialogs"
import { TaskStatusSelector } from "@/app/admin/tasks/task-status-selector"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"
import { TaskDAO } from "@/services/task-services"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarDays, Loader, MoreVertical } from "lucide-react"
import { useState } from "react"

interface MailDisplayProps {
  task: TaskDAO | null
  isAdmin: boolean
}

export function TaskDisplay({ task, isAdmin }: MailDisplayProps) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false);

  if (!task) {
    return null
  }

  const setDate = (date: Date | undefined) => {
    setLoading(true)
    if (date) {
      setDateAction(task.id, date)
      .then(() => {
        toast({ title: "Date updated" })
        setOpen(false)
      })
      .catch((error) => {
        toast({ title: "Error", description: error.message, variant: "destructive" })
      })
      .finally(() => {
        setLoading(false)
      })
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-2">
        <div className="flex items-center gap-2">
          <TaskDialog id={task.id} deliverableId={task.deliverableId} disabled={!task || !isAdmin} />
          <DeleteTaskDialog
            id={task.id} 
            description={`Do you want to delete Task: ${task.title}?`}
            disabled={!task || !isAdmin}
          />

          <Separator orientation="vertical" className="mx-1 h-6" />
          <Tooltip>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={!task || !isAdmin}>
                    {
                      loading ? <Loader className="h-5 w-5 animate-spin" /> : <CalendarDays className="h-5 w-5" />
                    }
                    <span className="sr-only">Date</span>
                  </Button>
                </TooltipTrigger>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <div className="p-2">
                  <Calendar 
                    mode="single"
                    selected={task.createdAt}
                    onSelect={setDate}
                    //month={task.createdAt}
                    initialFocus
                    locale={es}                        
                  
                  />
                </div>
              </PopoverContent>
            </Popover>
            <TooltipContent>Date</TooltipContent>
          </Tooltip>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <TaskDialog deliverableId={task.deliverableId} disabled={!task || !isAdmin} />
        </div>
        <Separator orientation="vertical" className="mx-2 h-6" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" disabled={!task || !isAdmin}>
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Mark as unread</DropdownMenuItem>
            <DropdownMenuItem>Star thread</DropdownMenuItem>
            <DropdownMenuItem>Add label</DropdownMenuItem>
            <DropdownMenuItem>Mute thread</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator />
      {task ? (
        <div className="flex flex-1 flex-col">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4 text-sm p-3">
              <Avatar>
                <AvatarImage alt={task?.title} />
                <AvatarFallback>
                  {task?.title
                    .split(" ")
                    .map((chunk) => chunk[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-semibold">{task?.title}</div>
                {task?.createdAt && (
                  <div className="text-xs text-muted-foreground">
                    {format(task?.createdAt, "PPP", { locale: es })}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <TaskStatusSelector id={task.id} status={task.status} disabled={!task || !isAdmin} />
              <Badge variant="green">
                {task.developments?.reduce((acc, development) => acc + development.actualHours, 0)}h
              </Badge>
            </div>
          </div>
          <Separator />
          <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
            {task?.description}
          </div>
          <Separator className="mt-auto" />
          <div className="p-4">
            <form className="w-full">
              <div className="flex justify-between w-full">
                <div className="flex flex-col w-full">
                  {
                    task?.developments?.map((development) => (
                      <div key={development.id} className="flex items-center justify-between">
                        <TitleDevelopmentDialog development={development} disabled={!task || !isAdmin} />
                        <DeleteDevelopmentDialog id={development.id} description={`Are you sure you want to delete ${development.date}?`} disabled={!task || !isAdmin} />
                      </div>
                    ))
                  }
                </div>
                <div>
                  {
                    task && isAdmin && <DevelopmentDialog disabled={!task || !isAdmin} taskId={task.id} />
                  }                  
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          No message selected
        </div>
      )}
    </div>
  )
}
