import * as z from "zod"
import { prisma } from "@/lib/db"
import { UserDAO } from "./user-services"
import { getUsersDAO } from "./user-services"

export type ClientDAO = {
	id: string
	name: string
  slug: string
	createdAt: Date
	users: UserDAO[]
}

export const clientSchema = z.object({
	name: z.string({required_error: "name is required."}),
})

export type ClientFormValues = z.infer<typeof clientSchema>


export async function getClientsDAO() {
  const found = await prisma.client.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as ClientDAO[]
}

export async function getClientDAO(id: string) {
  const found = await prisma.client.findUnique({
    where: {
      id
    },
  })
  return found as ClientDAO
}

export async function getClientDAOBySlug(slug: string) {
  const found = await prisma.client.findUnique({
    where: {
      slug
    },
  })
  return found as ClientDAO
}
    
export async function createClient(data: ClientFormValues) {
  const slug= data.name.toLowerCase().replace(/ /g, '-')
  const created = await prisma.client.create({
    data: {
      ...data,
      slug
    }
  })
  return created
}

export async function updateClient(id: string, data: ClientFormValues) {
  const updated = await prisma.client.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteClient(id: string) {
  const deleted = await prisma.client.delete({
    where: {
      id
    },
  })
  return deleted
}
    
export async function getComplentaryUsers(id: string) {
  const found = await prisma.client.findUnique({
    where: {
      id
    },
    include: {
      users: true,
    }
  })
  const all= await getUsersDAO()
  const res= all.filter(aux => {
    return !found?.users.find(c => c.id === aux.id)
  })
  
  return res
}

export async function setUsers(id: string, users: UserDAO[]) {
  const oldUsers= await prisma.client.findUnique({
    where: {
      id
    },
    include: {
      users: true,
    }
  })
  .then(res => res?.users)

  await prisma.client.update({
    where: {
      id
    },
    data: {
      users: {
        disconnect: oldUsers
      }
    }
  })

  const updated= await prisma.client.update({
    where: {
      id
    },
    data: {
      users: {
        connect: users.map(c => ({id: c.id}))
      }
    }
  })

  if (!updated) {
    return false
  }

  // connect users to client
  const userUpdated= await prisma.user.updateMany({
    where: {
      id: {
        in: users.map(c => c.id)
      }
    },
    data: {
      clientId: id
    }
  })



  return true
}



export async function getFullClientsDAO() {
  const found = await prisma.client.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
			users: true,
		}
  })
  return found as ClientDAO[]
}
  
export async function getFullClientDAO(id: string) {
  const found = await prisma.client.findUnique({
    where: {
      id
    },
    include: {
			users: true,
		}
  })
  return found as ClientDAO
}
    