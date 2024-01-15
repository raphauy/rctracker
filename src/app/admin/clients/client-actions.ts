"use server"
  
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/lib/auth"
import { ClientDAO, ClientFormValues, createClient, updateClient, getFullClientDAO, deleteClient, getClientDAOBySlug } from "@/services/client-services"

import { getComplentaryUsers, setUsers} from "@/services/client-services"
import { UserDAO } from "@/services/user-services"
    

export async function getClientDAOAction(id: string): Promise<ClientDAO | null> {
    return getFullClientDAO(id)
}

export async function getClientDAOBySlugAction(slug: string): Promise<ClientDAO | null> {
    return getClientDAOBySlug(slug)
}

export async function createOrUpdateClientAction(id: string | null, data: ClientFormValues): Promise<ClientDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateClient(id, data)
    } else {
        // const currentUser= await getCurrentUser()
        // if (!currentUser) {
        //   throw new Error("User not found")
        // }
        // updated= await createClient(data, currentUser.id)

        updated= await createClient(data)
    }     

    revalidatePath("/admin/clients")

    return updated as ClientDAO
}

export async function deleteClientAction(id: string): Promise<ClientDAO | null> {    
    const deleted= await deleteClient(id)

    revalidatePath("/admin/clients")

    return deleted as ClientDAO
}
    
export async function getComplentaryUsersAction(id: string): Promise<UserDAO[]> {
    const complementary= await getComplentaryUsers(id)

    return complementary as UserDAO[]
}

export async function setUsersAction(id: string, users: UserDAO[]): Promise<boolean> {
    const res= setUsers(id, users)

    revalidatePath("/admin/clients")

    return res
}


