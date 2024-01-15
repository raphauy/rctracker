"use server"
  
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/lib/auth"
import { DevelopmentDAO, DevelopmentFormValues, createDevelopment, updateDevelopment, getFullDevelopmentDAO, deleteDevelopment, setDevelopmentDate } from "@/services/development-services"


export async function getDevelopmentDAOAction(id: string): Promise<DevelopmentDAO | null> {
    return getFullDevelopmentDAO(id)
}

export async function createOrUpdateDevelopmentAction(id: string | null, data: DevelopmentFormValues): Promise<DevelopmentDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateDevelopment(id, data)
    } else {
        updated= await createDevelopment(data)
    }     

    revalidatePath("/admin/developments")

    return updated as DevelopmentDAO
}

export async function setDevelopmentDateAction(id: string, date: Date): Promise<DevelopmentDAO | null> {
    const updated= await setDevelopmentDate(id, date)

    revalidatePath("/admin/developments")

    return updated as DevelopmentDAO
}


export async function deleteDevelopmentAction(id: string): Promise<DevelopmentDAO | null> {    
    const deleted= await deleteDevelopment(id)

    revalidatePath("/admin/developments")

    return deleted as DevelopmentDAO
}

