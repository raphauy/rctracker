"use client"

import { DeleteDeliverableDialog, DeliverableDialog } from "@/app/admin/deliverables/deliverable-dialogs"
import { TaskDialog } from "@/app/admin/tasks/task-dialogs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { DeliverableDAO } from "@/services/deliverable-services"
import { TaskDAO } from "@/services/task-services"
import { CircleDollarSign, Package, Search } from "lucide-react"
import { useSearchParams } from "next/navigation"
import * as React from "react"
import { Nav } from "./nav"
import { ProjectSwitcher } from "./project-switcher"
import { TaskDisplay } from "./task-display"
import { TaskList } from "./task-list"

interface ProjectProps {
  isAdmin: boolean
  selectedProject: string
  projects: {
    label: string
    id: string
    icon: React.ReactNode
  }[]
  deliverables: DeliverableDAO[]
  defaultLayout: number[] | undefined
  defaultCollapsed?: boolean
  navCollapsedSize: number
}

export function TaskComponent({
  isAdmin,
  selectedProject,
  projects,
  deliverables,
  defaultLayout = [265, 440, 655],
  defaultCollapsed = false,
  navCollapsedSize,
}: ProjectProps) {

  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)
  const [deliverableSelected, setDeliverableSelected] = React.useState<DeliverableDAO>()
  const [taskSelected, setTaskSelected] = React.useState<TaskDAO | null>(null)
  const [initialTasks, setInitialTasks] = React.useState<TaskDAO[]>([])
  const [tasks, setTasks] = React.useState<TaskDAO[]>(initialTasks)
  const [summattion, setSummattion] = React.useState<SummationType>(getSummation(initialTasks))
  const [searchText, setSearchText] = React.useState("")

  const searchParams= useSearchParams()

  //isAdmin= false

  const links = deliverables.map((deliverable) => ({
    id: deliverable.id,
    title: deliverable.name,
    label: deliverable.tasks.length.toString(),
    icon: Package,
    variant: deliverableSelected?.id === deliverable.id ? "default" : "ghost",
  }))

  React.useEffect(() => {
    const deliverableId= searchParams.get("d")

    if (deliverableId) {
      const deliverable= deliverables.find((item) => item.id === deliverableId)
      if (deliverable) {
        setDeliverableSelected(deliverable)
        setTasks(deliverable.tasks)
        setSummattion(getSummation(deliverable.tasks))
        setInitialTasks(deliverable.tasks)
      }
    } else {
      if (deliverables.length > 0) {
        const deliverable= deliverables[0]
        setDeliverableSelected(deliverable)
        setTasks(deliverable.tasks)
        setSummattion(getSummation(deliverable.tasks))
        setInitialTasks(deliverable.tasks)
      } else {
        setDeliverableSelected(undefined)
        setTasks([])
      }
    }

    if (initialTasks.length === 0) {
      setTaskSelected(null)
    } else {
      setTaskSelected(initialTasks[0])
    }

    setSearchText("")
  
  }, [deliverables, searchParams, initialTasks])

  function filterTasks(text: string) {
    setSearchText(text)
    
    if (text.trim() === "") {
      setTasks(initialTasks)
      setSummattion(getSummation(initialTasks))
      return
    }
    const filtered= initialTasks.filter((task) => task.title.includes(text.trim().toLocaleLowerCase()) || task.description?.trim().toLowerCase().includes(text.trim().toLocaleLowerCase()))
    setTasks(filtered)
    setSummattion(getSummation(filtered))
  }
  
  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`
        }}
        className="h-full max-h-[800px] items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={false}
          minSize={20}
          maxSize={25}
          className={cn(isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out")}
        >
          <div className={cn("flex h-[52px] items-center justify-center", isCollapsed ? 'h-[52px]': 'px-2')}>
            <ProjectSwitcher isCollapsed={isCollapsed} projects={projects} isAdmin={isAdmin} />
          </div>
          <Separator />
          <Nav
            isAdmin={isAdmin}
            projectId={selectedProject}
            isCollapsed={isCollapsed}
            // @ts-ignore
            links={links}
          />
          <Separator />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30} className={cn(!deliverableSelected && "hidden")}>
          <Tabs defaultValue="all">
            <div className="flex items-center justify-between px-4 py-2">
              <h1 className="text-xl font-bold">{deliverableSelected?.name}</h1>
              <div className="flex items-center">
                <Separator orientation="vertical" className="mx-1 h-6" />
                {
                  deliverableSelected && (
                    <>
                      <DeliverableDialog id={deliverableSelected.id} projectId={deliverableSelected.projectId} disabled={!isAdmin} />
                      <DeleteDeliverableDialog description={`Are you sure you want to delete ${deliverableSelected.name}?`} id={deliverableSelected.id} disabled={!isAdmin} />
                    </>
                  )
                }
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-2">
              <div>
                {
                  summattion.estimatedHoursMedia > 0 && (
                    <>
                      <Badge variant="gray">{summattion.estimatedHoursMin}h</Badge>
                      <Badge variant="sky">{summattion.estimatedHoursMedia}h</Badge>
                      <Badge variant="gray">{summattion.estimatedHoursMax}h</Badge>    
                    </>
                  )
                }
              </div>
              <div className="flex items-center">
                <CircleDollarSign size={18} />
                {deliverableSelected && <p className="mt-0.5 ml-1">{Intl.NumberFormat("es-UY").format(deliverableSelected?.hourValue * summattion.actualHours)}</p>}
                <Separator orientation="vertical" className="mx-2 h-6" />
                <Badge variant="green">{summattion.actualHours}h</Badge>
              </div>
            </div>
            <Separator />
            {
               (
                <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex w-full gap-2">
                  <TabsList className="">
                    <TabsTrigger value="all" className="text-zinc-600 dark:text-zinc-200">All</TabsTrigger>
                    <TabsTrigger value="Active" className="text-zinc-600 dark:text-zinc-200">Active</TabsTrigger>
                  </TabsList>
    
                  <form className="w-full">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search" value={searchText} className="pl-8" onChange={(e) => filterTasks(e.target.value)} />
                    </div>
                  </form>
                </div>  
              )
            }
            <TabsContent value="all" className="m-0">
              <TaskList tasks={tasks} selectedTask={taskSelected} setSelectTask={setTaskSelected} />
            </TabsContent>
            <TabsContent value="Active" className="m-0">
              <TaskList tasks={tasks.filter((task) => task.status === "Active")} selectedTask={taskSelected} setSelectTask={setTaskSelected} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
          {
            taskSelected ? (
              <TaskDisplay
                task={taskSelected}
                isAdmin={isAdmin}
              />  
            ) : deliverableSelected && (
              <div className="flex justify-center mt-2">
                <TaskDialog deliverableId={deliverableSelected.id} />
              </div>
            )
            
          }
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}


export type SummationType = {
  estimatedHoursMin: number
  estimatedHoursMax: number
  estimatedHoursMedia: number
  actualHours: number
}

function getSummation(tasks: TaskDAO[]): SummationType {
  let estimatedHoursMin= 0
  let estimatedHoursMax= 0
  let estimatedHoursMedia= 0
  let actualHours= 0
  tasks.forEach((task) => {
    estimatedHoursMin+= task.estimatedHoursMin
    estimatedHoursMax+= task.estimatedHoursMax
    actualHours+= task.developments?.reduce((acc, development) => acc + development.actualHours, 0)
  })
  return {
    estimatedHoursMin,
    estimatedHoursMax,
    estimatedHoursMedia: (estimatedHoursMin + estimatedHoursMax) / 2,
    actualHours
  }
  
}