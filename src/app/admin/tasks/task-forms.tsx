"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { deleteTaskAction, createOrUpdateTaskAction, getTaskDAOAction } from "./task-actions"
import { taskSchema, TaskFormValues } from '@/services/task-services'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"

type Props= {
  id?: string
  deliverableId: string | null
  closeDialog?: () => void
}

export function TaskForm({ id, deliverableId, closeDialog }: Props) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {},
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)
  const router= useRouter()

  const onSubmit = async (data: TaskFormValues) => {
   
    setLoading(true)
    try {
      if (!deliverableId) {
        throw new Error("DeliverableId not found")
      }
      //data.deliverableId= deliverableId
      await createOrUpdateTaskAction(id ? id : null, data)
      toast({ title: id ? "Task updated" : "Task created" })
      if (closeDialog) {
        closeDialog()
      } else {
        router.push(`/admin/tasks`)
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      getTaskDAOAction(id).then((data) => {
        if (data) {
          form.setValue("title", data.title)
          form.setValue("description", data.description)
          form.setValue("deliverableId", data.deliverableId)
          form.setValue("status", data.status)
          form.setValue("estimatedHoursMin", data.estimatedHoursMin)
          form.setValue("estimatedHoursMax", data.estimatedHoursMax)          
        }
        Object.keys(form.getValues()).forEach((key: any) => {
          if (form.getValues(key) === null) {
            form.setValue(key, "")
          }
        })
      })
    } else {
      form.setValue("status", "Pending")
      if (deliverableId) {
        form.setValue("deliverableId", deliverableId)
      }
    }

  }, [form, id, deliverableId])

  return (
    <div className="p-4 bg-white rounded-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Task's title" {...field} />
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
                  <Textarea rows={10} placeholder="Task's description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="estimatedHoursMin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Hours Min</FormLabel>
                  <FormControl>
                    <Input placeholder="Task's estimatedHoursMin" type="number" {...field} 
                      onChange={e => {
                        if (e.target.value == "0") e.target.value = ""
                        if (e.target.value != "") e.target.value = parseInt(e.target.value)+""
                        field.onChange(e)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estimatedHoursMax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Hours Max</FormLabel>
                  <FormControl>
                    <Input placeholder="Task's estimatedHoursMax" type="number" {...field} 
                      onChange={e => {
                        if (e.target.value == "0") e.target.value = ""
                        if (e.target.value != "") e.target.value = parseInt(e.target.value)+""
                        field.onChange(e)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
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
  id: string
  closeDialog?: () => void
}

export function DeleteTaskForm({ id, closeDialog }: DeleteProps) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteTaskAction(id)
    .then(() => {
      toast({title: "Task deleted" })
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

