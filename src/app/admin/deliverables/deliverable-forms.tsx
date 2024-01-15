"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { DeliverableDAO, DeliverableFormValues, deliverableSchema } from '@/services/deliverable-services'
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { createOrUpdateDeliverableAction, deleteDeliverableAction, getDeliverableDAOAction } from "./deliverable-actions"

type Props= {
  id?: string
  projectId: string
  closeDialog?: () => void
}

export function DeliverableForm({ id, projectId, closeDialog }: Props) {
  const form = useForm<DeliverableFormValues>({
    resolver: zodResolver(deliverableSchema),
    defaultValues: {hourValue: 20},
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)
  const router= useRouter()

  const onSubmit = async (data: DeliverableFormValues) => {
    setLoading(true)
    try {
      data.projectId= projectId
      await createOrUpdateDeliverableAction(id ? id : null, data)
      toast({ title: id ? "Deliverable updated" : "Deliverable created" })
      if (closeDialog) {
        closeDialog()
      } else {
        router.push(`/admin/deliverables`)
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {

    if (id) {
      getDeliverableDAOAction(id).then((data) => {
        if (data) {
          form.reset(data)
        }
        Object.keys(form.getValues()).forEach((key: any) => {
          if (form.getValues(key) === null) {
            form.setValue(key, "")
          }
        })
      })
    }
    if (projectId)
      form.setValue("projectId", projectId)

  }, [form, id, projectId])

  return (
    <div className="p-4 bg-white rounded-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Deliverable's name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                <Textarea rows={10} placeholder="Deliverable's description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hourValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hour value</FormLabel>
                <FormControl>
                  <Input placeholder="Deliverable's hour value" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
        <div className="flex justify-end">
            <Button onClick={() => closeDialog && closeDialog()} type="button" variant={"secondary"} className="w-32">Cancel</Button>
            <Button type="submit" className="w-32 ml-2">
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : <p>Save</p>}
            </Button>
          </div>
        </form>
      </Form>
    </div>     
  )
}

type DeleteProps= {
  id?: string
  closeDialog?: () => void
}

export function DeleteDeliverableForm({ id, closeDialog }: DeleteProps) {
  const [loading, setLoading] = useState(false)
  const router= useRouter()
  const path= usePathname()

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteDeliverableAction(id)
    .then((deleted: DeliverableDAO | null) => {
      if (deleted) {
        toast({title: "Deliverable deleted" })
        const slug= path.split("/")[1]
        console.log(path, slug)
        router.push(`${slug}?p=${deleted.projectId}`)
      } else {
        toast({title: "Deliverable not found", variant: "destructive"})
      }
    })
    .catch((error) => {
      toast({title: "Error", description: error.message, variant: "destructive"})
    })
    .finally(() => {
      setLoading(false)
      closeDialog && closeDialog()
    })
  }
  
  return (
    <div>
      <Button onClick={() => closeDialog && closeDialog()} type="button" variant={"secondary"} className="w-32">Cancel</Button>
      <Button onClick={handleDelete} variant="destructive" className="w-32 ml-2 gap-1">
        { loading && <Loader className="h-4 w-4 animate-spin" /> }
        Delete  
      </Button>
    </div>
  )
}

