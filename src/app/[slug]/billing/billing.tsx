"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ProjectDAO } from "@/services/project-services"
import CostBox from "./cost-box"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Loader } from "lucide-react"
import { filterProjectsAction } from "./actions"
import { toast } from "@/components/ui/use-toast"

type Props = {
    slug: string
}
export function Billing({ slug }: Props) {

    const [idSelected, setIdSelected] = useState("")

    const [loading, setLoading] = useState(false)

    const [from, setFrom] = useState<Date | undefined>(new Date())
    const [to, setTo] = useState<Date | undefined>(new Date())

    const [projects, setProjects] = useState<ProjectDAO[]>([])
    const [price, setPrice] = useState(20)
  
    const [monthLabel, setMonthLabel] = useState("")
  
      useEffect(() => {
        const startMonth = format(from ?? new Date(), "MMMM", { locale: es })
        const endMonth = format(to ?? new Date(), "MMMM", { locale: es })
        const startYear = format(from ?? new Date(), "yyyy", { locale: es })
        const endYear = format(to ?? new Date(), "yyyy", { locale: es })
        if (startMonth === endMonth && startYear === endYear) {
          setMonthLabel(startMonth)
        } else {
          setMonthLabel("personalizado")
        }
      }, [from, to])

      useEffect(() => {
        const today = new Date()
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        setFrom(firstDay)
        setTo(lastDay)
        setIdSelected("")
        search(firstDay, lastDay)        
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

      function upMonth() {
        const newDate = new Date(from ?? new Date())
        const firstDay = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 1)
        const lastDay = new Date(newDate.getFullYear(), newDate.getMonth() + 2, 0)
        setFrom(firstDay)
        setTo(lastDay)
        search(firstDay, lastDay)
      }
    
      function downMonth() {
        const newDate = new Date(from ?? new Date())
        const firstDay = new Date(newDate.getFullYear(), newDate.getMonth() - 1, 1)
        const lastDay = new Date(newDate.getFullYear(), newDate.getMonth(), 0)
        setFrom(firstDay)
        setTo(lastDay)
        search(firstDay, lastDay)
      }
    
      function search(from: Date, to: Date) {
        setLoading(true)
        if (!from || !to) {
          console.log("no dates")
          return
        }
        to.setHours(23)
        to.setMinutes(59)
        to.setSeconds(59)
        to.setMilliseconds(999)
        
        filterProjectsAction(slug, from, to)
        .then((data) => {
            setProjects(data)
            const projectsWithValue= data.filter((project) => project.deliverables[0].hourValue > 0)
            console.log("projectsWithValue" + projectsWithValue)
            if (projectsWithValue.length < 1) {
                toast({ title: "No hay datos", description: `No se encontraron proyectos a facturar` })
                return
            }
            
          const price= projectsWithValue[0].deliverables[0].hourValue
          setPrice(price)
        })
        .catch((err) => {
          toast({ title: "Error al cargar los datos", description: `${err}`, variant: "destructive" })
        })
        .finally(() => {
          setLoading(false)
        })   
      }
    
    function handleSelectId(id: string) {
        if (idSelected === id) {
            setIdSelected("")
        } else {
            setIdSelected(id)
        }
    }

    let clientHours = 0

    return (
    <div className="flex flex-col items-center">
        <div className="text-sm">
            {
                loading ? <Loader className="w-5 h-5 animate-spin" /> :
                <p>{format(from ?? new Date(), "PP", { locale: es })} - {format(to ?? new Date(), "PP", { locale: es })}</p>
            }
        </div>
        <div className="flex items-center gap-4 mt-10">
            <Button size="icon" variant="outline" onClick={downMonth} disabled={loading}>
                <ChevronLeft className="w-5 h-5" />
                <span className="sr-only">Previous month</span>
            </Button>
            <p className="w-20 text-center">{monthLabel}</p>
            {/* disable the button if the month of to is the current month or later */}
            <Button size="icon" variant="outline" onClick={upMonth} disabled={to && to > new Date() || loading}>
                <ChevronRight className="w-5 h-5" />
                <span className="sr-only">Next month</span>
            </Button>
        </div>

        <Accordion type="single" collapsible className="w-full">
        {
            projects.map((project) => {
                let projectHours = 0
                // a project have deliverables and a deliverable have tasks and tasks have developments and developments have actualHours
                // iterate over all the projects and sum the actualHours
                project.deliverables.map((deliverable) => {
                    deliverable.tasks.map((task) => {
                        task.developments.map((development) => {
                            projectHours += development.actualHours
                        })
                    })
                })

                if (projectHours === 0) {
                    return null
                }

                clientHours += projectHours

                return (
                    <AccordionItem value={project.name} key={project.id}>
                        <AccordionTrigger>
                            <div className="flex flex-row justify-between w-full">
                                <p>{project.name}</p>
                                <CostBox hours={projectHours} price={price} />
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <Accordion type="single" collapsible className="w-full mt-5 pl-10">
                                {
                                    project.deliverables.map((deliverable) => {
                                        let deliverableHours = 0
                                        deliverable.tasks.map((task) => {
                                            task.developments.map((development) => {
                                                deliverableHours += development.actualHours
                                            })
                                        })
                                        if (deliverableHours === 0) {
                                            return null
                                        }
                                        return (
                                            <AccordionItem value={deliverable.id} key={deliverable.id}  className={cn(deliverable.id !== idSelected && "border-none", deliverable.id === idSelected && "bg-slate-50 pl-2 rounded-md border")}>
                                                <AccordionTrigger onClick={() => handleSelectId(deliverable.id)}>
                                                    <div className="flex flex-row justify-between w-full">
                                                        <p>{deliverable.name}</p>
                                                        <CostBox hours={deliverableHours} price={price} />
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="w-full mt-5 pl-20 pr-4">
                                                        {
                                                            deliverable.tasks.map((task) => {
                                                                let taskHours = 0
                                                                task.developments.map((development) => {
                                                                    taskHours += development.actualHours
                                                                })
                                                                if (taskHours === 0) {
                                                                    return null
                                                                }
                                                                return (
                                                                    <div className="flex justify-between w-full" key={task.id}>
                                                                        <p>{task.title}</p>
                                                                        <CostBox hours={taskHours} price={price} />
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        )
                                    })

                                }
                            </Accordion>
                        </AccordionContent>
                    </AccordionItem>
                )
            })
        }
        </Accordion>
        <div className="flex font-bold flex-row justify-between w-full pr-4 pt-4">
            <p>Total</p>
            <CostBox hours={clientHours} price={20} />
        </div>
    </div>
    )
}
