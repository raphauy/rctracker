"use client"

import { useEffect, useState } from "react";
import { ArrowLeftRight, ChevronsLeft, ChevronsRight, Loader, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ProjectForm, DeleteProjectForm } from "./project-forms"
import { getProjectDAOAction } from "./project-actions"

import { getComplentaryDeliverablesAction, setDeliverablesAction } from "./project-actions"
import { DeliverableDAO } from "@/services/deliverable-services"  
  
type Props= {
  id?: string
  clientId: string | null
  create?: boolean
}

const addTrigger= (
  <Button variant="ghost" className="px-2 flex w-full justify-start font-bold text-black">
    <PlusCircle className="h-4"/> Add Project
  </Button>
)
const updateTrigger= <Pencil size={30} className="pr-2 hover:cursor-pointer"/>

export function ProjectDialog({ id, clientId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {id ? updateTrigger : addTrigger }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? 'Update' : 'Create'} Project
          </DialogTitle>
        </DialogHeader>
        <ProjectForm closeDialog={() => setOpen(false)} id={id} clientId={clientId} />
      </DialogContent>
    </Dialog>
  )
}
  
type DeleteProps= {
  id: string
  description: string
}


export function DeleteProjectDialog({ id, description }: DeleteProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 className="hover:cursor-pointer"/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <DeleteProjectForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}

interface CollectionProps{
  id: string
  title: string
}

    
export function DeliverablesDialog({ id, title }: CollectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ArrowLeftRight className="hover:cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ProjectDeliverablesBox closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  );
}      




interface DeliverablesBoxProps{
  id: string
  closeDialog: () => void
}

export function ProjectDeliverablesBox({ id, closeDialog }: DeliverablesBoxProps) {

  const [loading, setLoading] = useState(false)
  const [deliverables, setDeliverables] = useState<DeliverableDAO[]>([])
  const [complementary, setComplementary] = useState<DeliverableDAO[]>([])

  useEffect(() => {
      getProjectDAOAction(id)
      .then((data) => {
          if(!data) return null
          if (!data.deliverables) return null
          console.log(data.deliverables)            
          setDeliverables(data.deliverables)
      })
      getComplentaryDeliverablesAction(id)
      .then((data) => {
          if(!data) return null
          setComplementary(data)
      })
  }, [id])

  function complementaryIn(id: string) {
      const comp= complementary.find((c) => c.id === id)
      if(!comp) return
      const newComplementary= complementary.filter((c) => c.id !== id)
      setComplementary(newComplementary)
      setDeliverables([...deliverables, comp])
  }

  function complementaryOut(id: string) {            
      const comp= deliverables.find((c) => c.id === id)
      if(!comp) return
      const newComplementary= deliverables.filter((c) => c.id !== id)
      setDeliverables(newComplementary)
      setComplementary([...complementary, comp])
  }

  function allIn() {
      setDeliverables([...deliverables, ...complementary])
      setComplementary([])
  }

  function allOut() {
      setComplementary([...complementary, ...deliverables])
      setDeliverables([])
  }

  async function handleSave() {
      setLoading(true)
      setDeliverablesAction(id, deliverables)
      .then(() => {
          toast({ title: "Deliverables updated" })
          closeDialog()
      })
      .catch((error) => {
          toast({ title: "Error updating deliverables" })
      })
      .finally(() => {
          setLoading(false)
      })
  }

  return (
      <div>
          <div className="grid grid-cols-2 gap-4 p-3 border rounded-md min-w-[400px] min-h-[300px]">
              <div className="flex flex-col border-r">
              {
                  deliverables.map((item) => {
                  return (
                      <div key={item.id} className="flex items-center justify-between gap-2 mb-1 mr-5">
                          <p className="whitespace-nowrap">{item.name}</p>
                          <Button variant="secondary" className="h-7" onClick={() => complementaryOut(item.id)}><ChevronsRight /></Button>
                      </div>
                  )})
              }
                      <div className="flex items-end justify-between flex-1 gap-2 mb-1 mr-5">
                          <p>Todos</p>
                          <Button variant="secondary" className="h-7" onClick={() => allOut()}><ChevronsRight /></Button>
                      </div>
              </div>
              <div className="flex flex-col">
              {
                  complementary.map((item) => {
                  return (
                      <div key={item.id} className="flex items-center gap-2 mb-1">
                          <Button variant="secondary" className="h-7 x-7" onClick={() => complementaryIn(item.id)}>
                              <ChevronsLeft />
                          </Button>
                          <p className="whitespace-nowrap">{item.name}</p>
                      </div>
                  )})
              }
                  <div className="flex items-end flex-1 gap-2 mb-1">
                      <Button variant="secondary" className="h-7" onClick={() => allIn()}><ChevronsLeft /></Button>
                      <p>Todos</p>
                  </div>
              </div>
          </div>

          <div className="flex justify-end mt-4">
              <Button type="button" variant={"secondary"} className="w-32" onClick={() => closeDialog()}>Cancelar</Button>
              <Button onClick={handleSave} className="w-32 ml-2" >{loading ? <Loader className="animate-spin" /> : <p>Save</p>}</Button>
          </div>
      </div>
  )
} 
  
