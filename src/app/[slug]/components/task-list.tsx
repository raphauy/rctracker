import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { TaskDAO } from "@/services/task-services"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { ComponentProps } from "react"


interface TaskListProps {
  tasks: TaskDAO[]
  selectedTask: TaskDAO | null
  setSelectTask: (task: TaskDAO) => void
}

export function TaskList({ tasks, selectedTask, setSelectTask }: TaskListProps) {

  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {tasks.map((task) => {
          // calculate the estimated hours as a media between the estimatedHoursMin and estimatedHoursMax
          const estimatedHours= (task.estimatedHoursMin + task.estimatedHoursMax) / 2
          return (
          <button
            key={task.id}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
              selectedTask && selectedTask.id === task.id && "bg-muted"
            )}
            onClick={() =>
              setSelectTask(task)
            }
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  {task.status === "Pending" && (
                    <span className="flex h-3 w-3 rounded-full bg-orange-700" />
                  )}
                  {task.status === "Active" && (
                    <span className="flex h-3 w-3 rounded-full bg-green-700" />
                  )}
                  {task.status === "Finished" && (
                    <span className="flex h-3 w-3 rounded-full bg-sky-700" />
                  )}
                  <div className="font-semibold">{task.title}</div>
                </div>
                <div
                  className={cn(
                    "ml-auto text-xs",
                    selectedTask && selectedTask.id === task.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {formatDistanceToNow(task.createdAt, {
                    addSuffix: true,
                    locale: es,
                  })}
                </div>
              </div>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {task.description?.substring(0, 300)}
            </div>
            <div className="flex items-center justify-between w-full">
              <div>
                {estimatedHours > 0 && (
                  <>
                    <Badge variant="gray">{task.estimatedHoursMin}h</Badge>
                    <Badge variant="sky">{estimatedHours}h</Badge>
                    <Badge variant="gray">{task.estimatedHoursMax}h</Badge>
                  </>
                )}
              </div>

              <Badge variant="green">
                {
                  task.developments?.reduce((acc, development) => acc + development.actualHours, 0)
                }h
              </Badge>
            </div>
          </button>
        )})}
      </div>
    </ScrollArea>
  )
}

