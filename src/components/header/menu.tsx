
import { getCurrentUser } from "@/lib/auth";
import MenuAdmin from "./menu-admin";
import { ClientSelector, SelectorData } from "./client-selector";
import { getClientDAO, getClientsDAO } from "@/services/client-services";
import ClientsMenu from "./client-menu";

export default async function Menu() {
    
    const user= await getCurrentUser()

    if (!user) return <div></div>

    const clients= await getClientsDAO()
    const selectorData: SelectorData[]= clients.map(client => ({slug: client.slug, name: client.name}))

    if (user.role === "admin") 
        return (
            <div className="flex">
                <div className="flex items-center">
                    <p className="ml-1 text-2xl hidden sm:block">/</p>
                    <ClientSelector selectors={selectorData} />
                    <MenuAdmin />
                </div>
            </div>
        )

    const clientId= user.clientId
    const client= await getClientDAO(clientId)

    return (
        <div className="flex items-center gap-3">
            <p className="ml-1 text-2xl hidden sm:block">/</p>
            <p className="justify-between font-bold text-lg whitespace-nowrap">
                {client.name}
            </p>
            <p className="ml-1 text-2xl hidden sm:block">/</p>
            <ClientsMenu />
        </div>

    );
}
