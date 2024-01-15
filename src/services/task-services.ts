import * as z from "zod"
import { prisma } from "@/lib/db"
import { DeliverableDAO } from "./deliverable-services"
import { DevelopmentDAO } from "./development-services"

export type TaskDAO = {
	id: string
	title: string
	description: string | undefined
	dueDate: Date | undefined
	status: string
	estimatedHoursMin: number
  estimatedHoursMax: number
	createdAt: Date
	updatedAt: Date
	deliverableId: string
	deliverable: DeliverableDAO
  developments: DevelopmentDAO[]
}

export const taskSchema = z.object({
	title: z.string({required_error: "title is required."}),
	description: z.string().optional(),
	dueDate: z.date().optional(),
	status: z.string({required_error: "status is required."}),
  estimatedHoursMin: z.coerce.number().optional(),
  estimatedHoursMax: z.coerce.number().optional(),
	deliverableId: z.string({required_error: "deliverableId is required."}),
})

export type TaskFormValues = z.infer<typeof taskSchema>


export async function getTasksDAO() {
  const found = await prisma.task.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as TaskDAO[]
}

export async function getTasksDAOByDeliverableId(deliverableId: string) {
  const found = await prisma.task.findMany({
    where: {
      deliverableId
    },
    orderBy: {
      id: 'asc'
    },
    include: {
      developments: true
    }
  })
  return found as TaskDAO[]
}

export async function getTaskDAO(id: string) {
  const found = await prisma.task.findUnique({
    where: {
      id
    },
    include: {
      developments: true
    }
  })
  return found as TaskDAO
}
    
export async function createTask(data: TaskFormValues) {

  const created = await prisma.task.create({
    data
  })
  return created
}

export async function updateTask(id: string, data: TaskFormValues) {
  const updated = await prisma.task.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function setDate(id: string, date: Date) {
  const updated = await prisma.task.update({
    where: {
      id
    },
    data: {
      createdAt: date
    }
  })
  return updated
}

export async function deleteTask(id: string) {
  const deleted = await prisma.task.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullTasksDAO() {
  const found = await prisma.task.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
			deliverable: true,
      developments: true
		}
  })
  return found as TaskDAO[]
}
  
export async function getFullTaskDAO(id: string) {
  const found = await prisma.task.findUnique({
    where: {
      id
    },
    include: {
			deliverable: true,
      developments: true
		}
  })
  return found as TaskDAO
}
    
export async function updateTaskStatus(id: string, status: string): Promise<string | null> {
  const updated = await prisma.task.update({
    where: {
      id
    },
    data: {
      status
    }
  })
  if (!updated) return null
  
  // get the client slug
  const client = await prisma.client.findFirst({
    where: {
      projects: {
        some: {
          deliverables: {
            some: {
              tasks: {
                some: {
                  id
                }
              }
            }
          }
        }
      }      
    }
  })

  if (!client) return null

  return client.slug
}
