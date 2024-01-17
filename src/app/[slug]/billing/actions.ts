"use server"

import { ProjectDAO, filterProjects } from "@/services/project-services"



  
export async function filterProjectsAction(slug: string, from: Date, to: Date): Promise<ProjectDAO[]> {
    const data= await filterProjects(slug, from, to)

    return data
}