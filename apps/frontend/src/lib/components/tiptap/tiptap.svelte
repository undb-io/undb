<script lang="ts">
  import "./tiptap.css"
  import { onMount, onDestroy, createEventDispatcher } from "svelte"
  import { Editor } from "@tiptap/core"
  import StarterKit from "@tiptap/starter-kit"
  import { Button } from "../ui/button"
  import { BoldIcon, CodeIcon, ItalicIcon } from "lucide-svelte"

  let element: HTMLDivElement
  let editor: Editor
  export let onValueChange: (value: string) => void

  export let readonly = false

  const dispatch = createEventDispatcher()

  export let value: string | undefined

  onMount(() => {
    editor = new Editor({
      element: element,
      editable: !readonly,
      extensions: [StarterKit],
      content: value,
      onTransaction: () => {
        // force re-render so `editor.isActive` works as expected
        editor = editor
      },
      onBlur(props) {
        const html = props.editor.getHTML()
        value = html
        dispatch("blur", html)
      },
      onUpdate(props) {
        const html = props.editor.getHTML()
        value = html
        dispatch("change", html)
        onValueChange?.(html)
      },
    })
  })

  onDestroy(() => {
    if (editor) {
      editor.destroy()
    }
  })
</script>

{#if editor && !readonly}
  <div class="flex h-10 items-center justify-between">
    <slot />

    <div class="flex items-center gap-1">
      <Button
        size="sm"
        type="button"
        variant={editor.isActive("bold") ? "default" : "ghost"}
        class="h-7 w-7 px-2"
        on:click={() => editor.chain().focus().toggleBold().run()}
      >
        <BoldIcon class="h-full w-full font-bold" />
      </Button>
      <Button
        size="sm"
        type="button"
        variant={editor.isActive("italic") ? "default" : "ghost"}
        class="h-7 w-7 px-2"
        on:click={() => editor.chain().focus().toggleItalic().run()}
      >
        <ItalicIcon class="h-full w-full" />
      </Button>
      <Button
        size="sm"
        type="button"
        variant={editor.isActive("code") ? "default" : "ghost"}
        class="h-7 w-7 px-2"
        on:click={() => editor.chain().focus().toggleCode().run()}
      >
        <CodeIcon class="h-full w-full" />
      </Button>
      <Button
        size="sm"
        type="button"
        variant={editor.isActive("heading", { level: 1 }) ? "default" : "ghost"}
        class="h-7 w-7"
        on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        H1
      </Button>
      <Button
        size="sm"
        type="button"
        on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        variant={editor.isActive("heading", { level: 2 }) ? "default" : "ghost"}
        class="h-7 w-7"
      >
        H2
      </Button>
      <Button
        size="sm"
        type="button"
        on:click={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        variant={editor.isActive("heading", { level: 3 }) ? "default" : "ghost"}
        class="h-7 w-7"
      >
        H3
      </Button>
      <Button
        size="sm"
        type="button"
        on:click={() => editor.chain().focus().setParagraph().run()}
        variant={editor.isActive("paragraph") ? "default" : "ghost"}
        class="h-7 w-7"
      >
        P
      </Button>
    </div>
  </div>
{/if}

<div class={$$restProps.class} bind:this={element} />
