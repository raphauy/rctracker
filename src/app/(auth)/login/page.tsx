import { Command, Link } from "lucide-react"
import { Metadata } from "next"

import getSession, { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { UserAuthForm } from "./user-auth-form"
import { getClientDAO } from "@/services/client-services"

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
}

export default async function AuthenticationPage() {
  const user= await getCurrentUser()
  const role= user?.role
  console.log("login: " + role)  
  if (role === "admin")
    redirect("/admin")
  else if (user && role === "client") {
    const client= await getClientDAO(user.clientId)
    console.log(client.name)    
    const slug= client.slug
    redirect(`/${slug}`)

  } else if (role === "user")
    redirect("/")

    return (
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] mt-10 bg-background text-muted-foreground p-10 rounded-xl">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Identificación de usuarios
          </h1>
        </div>
        <UserAuthForm />
      </div>
)
  }