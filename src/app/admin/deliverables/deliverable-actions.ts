"use server"
  
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/lib/auth"
import { DeliverableDAO, DeliverableFormValues, createDeliverable, updateDeliverable, getFullDeliverableDAO, deleteDeliverable } from "@/services/deliverable-services"

import { getComplentaryTasks, setTasks} from "@/services/deliverable-services"
import { TaskDAO } from "@/services/task-services"
    

export async function getDeliverableDAOAction(id: string): Promise<DeliverableDAO | null> {
    return getFullDeliverableDAO(id)
}

export async function createOrUpdateDeliverableAction(id: string | null, data: DeliverableFormValues): Promise<DeliverableDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateDeliverable(id, data)
    } else {

        updated= await createDeliverable(data)
    }     

    revalidatePath("/admin/deliverables")

    return updated as DeliverableDAO
}

export async function deleteDeliverableAction(id: string): Promise<DeliverableDAO | null> {    
    const deleted= await deleteDeliverable(id)

    revalidatePath("/admin/deliverables")

    return deleted as DeliverableDAO
}
    
export async function getComplentaryTasksAction(id: string): Promise<TaskDAO[]> {
    const complementary= await getComplentaryTasks(id)

    return complementary as TaskDAO[]
}

export async function setTasksAction(id: string, tasks: TaskDAO[]): Promise<boolean> {
    const res= setTasks(id, tasks)

    revalidatePath("/admin/deliverables")

    return res
}


