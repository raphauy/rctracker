"use server"
  
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/lib/auth"
import { ProjectDAO, ProjectFormValues, createProject, updateProject, getFullProjectDAO, deleteProject } from "@/services/project-services"

import { getComplentaryDeliverables, setDeliverables} from "@/services/project-services"
import { DeliverableDAO } from "@/services/deliverable-services"
    

export async function getProjectDAOAction(id: string): Promise<ProjectDAO | null> {
    return getFullProjectDAO(id)
}

export async function createOrUpdateProjectAction(clientId: string | null, id: string | null, data: ProjectFormValues): Promise<ProjectDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateProject(id, data)
    } else {
        if (!clientId) {
            throw new Error("Client not found")
        }

        updated= await createProject(clientId, data)
    }     

    revalidatePath("/admin/projects")

    return updated as ProjectDAO
}

export async function deleteProjectAction(id: string): Promise<ProjectDAO | null> {    
    const deleted= await deleteProject(id)

    revalidatePath("/admin/projects")

    return deleted as ProjectDAO
}
    
export async function getComplentaryDeliverablesAction(id: string): Promise<DeliverableDAO[]> {
    const complementary= await getComplentaryDeliverables(id)

    return complementary as DeliverableDAO[]
}

export async function setDeliverablesAction(id: string, deliverables: DeliverableDAO[]): Promise<boolean> {
    const res= setDeliverables(id, deliverables)

    revalidatePath("/admin/projects")

    return res
}


