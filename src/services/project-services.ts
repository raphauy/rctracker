import * as z from "zod"
import { prisma } from "@/lib/db"
import { ClientDAO } from "./client-services"
import { DeliverableDAO } from "./deliverable-services"
import { getDeliverablesDAO } from "./deliverable-services"

export type ProjectDAO = {
	id: string
	name: string
	description: string | undefined
	estimatedHours: number
	actualHours: number
	createdAt: Date
	updatedAt: Date
	clientId: string
	client: ClientDAO
	deliverables: DeliverableDAO[]
}

export const projectSchema = z.object({
	name: z.string({required_error: "name is required."}),
	description: z.string().optional(),
})

export type ProjectFormValues = z.infer<typeof projectSchema>


export async function getProjectsDAO() {
  const found = await prisma.project.findMany({
    orderBy: {
      createdAt: 'desc'
    },
  })
  return found as ProjectDAO[]
}

export async function getProjectsDAOBySlug(clientSlug: string) {
  const found = await prisma.project.findMany({
    where: {
      client: {
        slug: clientSlug
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
  })
  return found as ProjectDAO[]
}

export async function getProjectDAO(id: string) {
  const found = await prisma.project.findUnique({
    where: {
      id
    },
  })
  return found as ProjectDAO
}
    
export async function createProject(clientId:string, data: ProjectFormValues) {
  const created = await prisma.project.create({
    data: {
      ...data,
      client: {
        connect: {
          id: clientId
        }
      }
    }
  })
  return created
}

export async function updateProject(id: string, data: ProjectFormValues) {
  const updated = await prisma.project.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteProject(id: string) {
  const deleted = await prisma.project.delete({
    where: {
      id
    },
  })
  return deleted
}
    
export async function getComplentaryDeliverables(id: string) {
  const found = await prisma.project.findUnique({
    where: {
      id
    },
    include: {
      deliverables: true,
    }
  })
  const all= await getDeliverablesDAO()
  const res= all.filter(aux => {
    return !found?.deliverables.find(c => c.id === aux.id)
  })
  
  return res
}

export async function setDeliverables(id: string, deliverables: DeliverableDAO[]) {
  const oldDeliverables= await prisma.project.findUnique({
    where: {
      id
    },
    include: {
      deliverables: true,
    }
  })
  .then(res => res?.deliverables)

  await prisma.project.update({
    where: {
      id
    },
    data: {
      deliverables: {
        disconnect: oldDeliverables
      }
    }
  })

  const updated= await prisma.project.update({
    where: {
      id
    },
    data: {
      deliverables: {
        connect: deliverables.map(c => ({id: c.id}))
      }
    }
  })

  if (!updated) {
    return false
  }

  return true
}



export async function getFullProjectsDAO() {
  const found = await prisma.project.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
			client: true,
			deliverables: true,
		}
  })
  return found as ProjectDAO[]
}
  
export async function getFullProjectDAO(id: string) {
  const found = await prisma.project.findUnique({
    where: {
      id
    },
    include: {
			client: true,
			deliverables: true,
		}
  })
  return found as ProjectDAO
}
    