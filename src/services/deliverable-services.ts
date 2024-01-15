import * as z from "zod"
import { prisma } from "@/lib/db"
import { ProjectDAO } from "./project-services"
import { TaskDAO } from "./task-services"
import { getTasksDAO } from "./task-services"

export type DeliverableDAO = {
	id: string
	name: string
	description: string | undefined
  hourValue: number
	estimatedHours: number
	actualHours: number
	createdAt: Date
	updatedAt: Date
	projectId: string
	project: ProjectDAO
	tasks: TaskDAO[]
}

export const deliverableSchema = z.object({
	name: z.string({required_error: "name is required."}),
	description: z.string().optional(),
  hourValue: z.coerce.number(),
	projectId: z.string({required_error: "projectId is required."}),
})

export type DeliverableFormValues = z.infer<typeof deliverableSchema>


export async function getDeliverablesDAO() {
  const found = await prisma.deliverable.findMany({
    orderBy: {
      createdAt: 'desc'
    },
  })
  return found as DeliverableDAO[]
}

export async function getDeliverablesDAOByProjectId(projectId: string) {
  const found = await prisma.deliverable.findMany({
    where: {
      projectId
    },
    include: {
      project: true,
      tasks: {
        include: {
          developments: {
            orderBy: {
              date: 'desc'
            }
          }          
        },
        orderBy: {
          createdAt: 'desc'
        },
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
  })
  
  return found as DeliverableDAO[]
}

export async function getDeliverableDAO(id: string) {
  const found = await prisma.deliverable.findUnique({
    where: {
      id
    },
  })
  return found as DeliverableDAO
}
    
export async function createDeliverable(data: DeliverableFormValues) {
  const created = await prisma.deliverable.create({
    data
  })
  return created
}

export async function updateDeliverable(id: string, data: DeliverableFormValues) {
  const updated = await prisma.deliverable.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteDeliverable(id: string) {
  const deleted = await prisma.deliverable.delete({
    where: {
      id
    },
  })
  return deleted
}
    
export async function getComplentaryTasks(id: string) {
  const found = await prisma.deliverable.findUnique({
    where: {
      id
    },
    include: {
      tasks: true,
    }
  })
  const all= await getTasksDAO()
  const res= all.filter(aux => {
    return !found?.tasks.find(c => c.id === aux.id)
  })
  
  return res
}

export async function setTasks(id: string, tasks: TaskDAO[]) {
  const oldTasks= await prisma.deliverable.findUnique({
    where: {
      id
    },
    include: {
      tasks: true,
    }
  })
  .then(res => res?.tasks)

  await prisma.deliverable.update({
    where: {
      id
    },
    data: {
      tasks: {
        disconnect: oldTasks
      }
    }
  })

  const updated= await prisma.deliverable.update({
    where: {
      id
    },
    data: {
      tasks: {
        connect: tasks.map(c => ({id: c.id}))
      }
    }
  })

  if (!updated) {
    return false
  }

  return true
}



export async function getFullDeliverablesDAO() {
  const found = await prisma.deliverable.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
			project: true,
			tasks: true,
		}
  })
  return found as DeliverableDAO[]
}
  
export async function getFullDeliverableDAO(id: string) {
  const found = await prisma.deliverable.findUnique({
    where: {
      id
    },
    include: {
			project: true,
			tasks: true,
		}
  })
  return found as DeliverableDAO
}
    