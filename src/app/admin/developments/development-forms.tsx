"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { deleteDevelopmentAction, createOrUpdateDevelopmentAction, getDevelopmentDAOAction } from "./development-actions"
import { developmentSchema, DevelopmentFormValues } from '@/services/development-services'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { es } from "date-fns/locale"

type Props= {
  id?: string
  taskId: string | null
  closeDialog: () => void
}

export function DevelopmentForm({ id, taskId, closeDialog }: Props) {
  const form = useForm<DevelopmentFormValues>({
    resolver: zodResolver(developmentSchema),
    defaultValues: {
      date: new Date(),
    },
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: DevelopmentFormValues) => {
    setLoading(true)
    try {
      if (!taskId) {
        throw new Error("Task not found")
      }

      await createOrUpdateDevelopmentAction(id ? id : null, data)
      toast({ title: id ? "Development updated" : "Development created" })
      closeDialog()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      getDevelopmentDAOAction(id).then((data) => {
        if (data) {
          form.reset(data)
        }
        Object.keys(form.getValues()).forEach((key: any) => {
          if (form.getValues(key) === null) {
            form.setValue(key, "")
          }
        })
      })
    } else {
      if (taskId) {
        form.setValue("taskId", taskId)
      }
    }
  }, [form, id, taskId])

  return (
    <div className="p-4 bg-white rounded-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          <FormField
            control={form.control}
            name="actualHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ActualHours</FormLabel>
                <FormControl>
                  <Input placeholder="Development's actualHours" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <Calendar
              mode="single"
              selected={field.value}
              onSelect={field.onChange}
              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
              locale={es}
            />
            )}
          />


        <div className="flex justify-end">
            <Button onClick={() => closeDialog()} type="button" variant={"secondary"} className="w-32">Cancel</Button>
            <Button type="submit" className="w-32 ml-2">
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : <p>Save</p>}
            </Button>
          </div>
        </form>
      </Form>
    </div>     
  )
}

export function DeleteDevelopmentForm({ id, closeDialog }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteDevelopmentAction(id)
    .then(() => {
      toast({title: "Development deleted" })
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

