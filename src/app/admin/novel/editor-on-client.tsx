"use client"

import { Editor as NovelEditor } from "novel";
import { Editor } from '@tiptap/core'


export default function NovelOnClient() {

    function onUpdate(editor: Editor | undefined) {
        console.log(editor?.getJSON())
        
    }

    return (
        <main className="flex h-full flex-col items-center justify-between sm:p-4 xl:p-8">
        <NovelEditor
            defaultValue={defaultEditorContent}
            onUpdate={onUpdate}
        />
        </main>
    )
}



export const defaultEditorContent = {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Introducción a Tinta Blog" }],
      },
      {
        type: "paragraph",
        content: [
            {
                type: "text",
                text: "Tinta Blog utiliza Novel, un editor WYSIWYG al estilo de Notion con autocompletado impulsado por IA.",
            },
        ],
      },
      {
        type: "paragraph",
        content: [
            {
                type: "text",
                text: "Prueba digitando la barra diagonal / al inicio de un párrafo para ver las opciones de autocompletado.",
            },
        ],
      },    ],
  };