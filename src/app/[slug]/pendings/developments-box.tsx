import { Badge } from "@/components/ui/badge"
import { DevelopmentDAO } from "@/services/development-services"
import { format } from "date-fns"
import { es } from "date-fns/locale"

type Props = {
    developments: DevelopmentDAO[]
}

export default function DevelopmentBox({ developments }: Props) {
    const totalHours = developments.reduce((acc, development) => acc + development.actualHours, 0)
    if (totalHours === 0) return null

    return (
        <div className="flex flex-col border-l pl-2 ml-2">
        {
            developments.map((development) => (
                <div key={development.id} className="p-1 flex gap-5 w-44 justify-between" >
                    <p className="whitespace-nowrap">{format(development.date, "PP", { locale: es })}:</p>
                    <Badge variant="green">{development.actualHours}h</Badge>
                </div>
            ))
        }
        </div>

    )
}
