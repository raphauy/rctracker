"use server"
  
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/lib/auth"
import { TaskDAO, TaskFormValues, createTask, updateTask, getFullTaskDAO, deleteTask, setDate, updateTaskStatus } from "@/services/task-services"


export async function getTaskDAOAction(id: string): Promise<TaskDAO | null> {
    return getFullTaskDAO(id)
}

export async function createOrUpdateTaskAction(id: string | null, data: TaskFormValues): Promise<TaskDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateTask(id, data)
    } else {
        updated= await createTask(data)
    }     

    revalidatePath("/admin/tasks")

    return updated as TaskDAO
}

export async function setDateAction(id: string, date: Date): Promise<TaskDAO | null> {
    const updated= await setDate(id, date)

    revalidatePath("/admin/tasks")

    return updated as TaskDAO
}

export async function deleteTaskAction(id: string): Promise<TaskDAO | null> {    
    const deleted= await deleteTask(id)

    revalidatePath("/admin/tasks")

    return deleted as TaskDAO
}

export async function updateTaskStatusAction(id: string, status: string): Promise<boolean>{  
    const slug= await updateTaskStatus(id, status)
    if (!slug) return false

    revalidatePath(`/${slug}`)
    
    return true
}
