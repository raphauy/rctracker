import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { getClientDAO } from "@/services/client-services";
import { getCurrentUser } from "@/lib/auth";

export default async function ClientsMenu() {
    const user= await getCurrentUser()
    if (!user) return <div>Client not found</div>

    const client= await getClientDAO(user.clientId)
    const slug= client.slug

    return (
        <div className="flex flex-1 gap-6 md:gap-5 h-10">
            <nav>
                <ul className="flex items-center">
                    <li className={`flex items-center border-b-first-color hover:border-b-first-color hover:border-b-2 h-11}`}>
                        <Link href={`/${slug}`}><Button className="text-lg" variant="ghost">Projects</Button></Link>
                    </li>
                    <li className={`flex items-center border-b-first-color hover:border-b-first-color hover:border-b-2 h-11}`}>
                        <Link href={`/${slug}/billing`}><Button className="text-lg" variant="ghost">Billing</Button></Link>
                    </li>
                </ul>
            </nav>

        </div>
    );
}
