import * as z from "zod"
import { prisma } from "@/lib/db"
import { TaskDAO } from "./task-services"

export type DevelopmentDAO = {
	id: string
	comments: string | undefined
	actualHours: number
	date: Date
	taskId: string
	task: TaskDAO
}

export const developmentSchema = z.object({
	comments: z.string().optional(),
	actualHours: z.coerce.number(),
  date: z.date(),
	taskId: z.string({required_error: "taskId is required."}),
})

export type DevelopmentFormValues = z.infer<typeof developmentSchema>


export async function getDevelopmentsDAO() {
  const found = await prisma.development.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as DevelopmentDAO[]
}

export async function getDevelopmentDAO(id: string) {
  const found = await prisma.development.findUnique({
    where: {
      id
    },
  })
  return found as DevelopmentDAO
}
    
export async function createDevelopment(data: DevelopmentFormValues) {
  // TODO: implement createDevelopment
  const created = await prisma.development.create({
    data
  })
  return created
}

export async function updateDevelopment(id: string, data: DevelopmentFormValues) {
  const updated = await prisma.development.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteDevelopment(id: string) {
  const deleted = await prisma.development.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullDevelopmentsDAO() {
  const found = await prisma.development.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
			task: true,
		}
  })
  return found as DevelopmentDAO[]
}
  
export async function getFullDevelopmentDAO(id: string) {
  const found = await prisma.development.findUnique({
    where: {
      id
    },
    include: {
			task: true,
		}
  })
  return found as DevelopmentDAO
}

export async function setDevelopmentDate(id: string, date: Date) {
  const updated = await prisma.development.update({
    where: {
      id
    },
    data: {
      date
    }
  })
  return updated
}