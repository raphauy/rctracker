import { Separator } from "@/components/ui/separator"

type Props = {
    hours: number
    total: number
}
export default function CostBox({ hours, total }: Props) {
  return (
    <div className="text-right flex items-center justify-end">
        <p className="">{hours} hs</p>
        <Separator orientation="vertical" className="h-4 mx-2" />
        <p className="w-20">{Intl.NumberFormat("es-UY", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(total)}</p>
    </div>
  )
}
