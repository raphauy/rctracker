import * as z from "zod"
import { prisma } from "@/lib/db"
import { UserDAO } from "./user-services"

export type SessionDAO = {
	id: string
	sessionToken: string
	userId: string
	expires: Date
	user: UserDAO
}

export const sessionSchema = z.object({
	
})

export type SessionFormValues = z.infer<typeof sessionSchema>


export async function getSessionsDAO() {
  const found = await prisma.session.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as SessionDAO[]
}

export async function getSessionDAO(id: string) {
  const found = await prisma.session.findUnique({
    where: {
      id
    },
  })
  return found as SessionDAO
}
    
export async function createSession(data: SessionFormValues) {
  // TODO: implement createSession
  // const created = await prisma.session.create({
  //   data
  // })
  // return created
}

export async function updateSession(id: string, data: SessionFormValues) {
  const updated = await prisma.session.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteSession(id: string) {
  const deleted = await prisma.session.delete({
    where: {
      id
    },
  })
  return deleted
}

export async function getFullSessionsDAO() {
  const found = await prisma.session.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
			user: true,
		}
  })
  return found as SessionDAO[]
}
  
export async function getFullSessionDAO(id: string) {
  const found = await prisma.session.findUnique({
    where: {
      id
    },
    include: {
			user: true,
		}
  })
  return found as SessionDAO
}
    