<script lang="ts">
  import { trpc } from "$lib/trpc/client"
  import { cn } from "$lib/utils"
  import { createMutation } from "@tanstack/svelte-query"
  import type { LongTextField, StringField } from "@undb/table"
  import { toast } from "svelte-sonner"
  import { gridViewStore } from "../grid-view.store"
  import { Maximize2Icon } from "lucide-svelte"
  import * as Dialog from "$lib/components/ui/dialog"
  import Tiptap from "$lib/components/tiptap/tiptap.svelte"

  export let tableId: string
  export let field: LongTextField
  export let value: string
  export let recordId: string
  export let isEditing: boolean
  export let isSelected: boolean
  export let readonly: boolean
  export let onValueChange: (value: string) => void

  const updateCell = createMutation({
    mutationKey: ["record", tableId, field.id.value, recordId],
    mutationFn: trpc.record.update.mutate,
    onSuccess(data, variables, context) {
      el?.blur()
      open = false
      gridViewStore.exitEditing()
      onValueChange(value)
    },
    onError(error: Error) {
      toast.error(error.message)
    },
  })

  let el: HTMLTextAreaElement
  $: if (isEditing) {
    if (el) {
      el.focus()
    }
  }

  let open = false
</script>

{#if field.allowRichText}
  <div class={cn("relative overflow-hidden", $$restProps.class)}>
    {#if isEditing || isSelected}
      <div class="flex w-full justify-between overflow-hidden text-left">
        <button type="button" on:click={() => (open = true)} class="flex-1 items-start text-left">
          <span class="inline-flex flex-1 self-start truncate">
            {@html value}
          </span>
        </button>
        <button on:click={() => (open = true)}>
          <Maximize2Icon class="text-muted-foreground h-3 w-3" />
        </button>
      </div>
    {:else if value}
      <div class="inline-flex flex-1 items-center truncate">
        {@html value}
      </div>
    {/if}
  </div>
{:else}
  <div class={cn("relative", $$restProps.class, isEditing && "border-none")}>
    {#if isEditing}
      <div class="absolute -bottom-10 left-0 right-0 top-0">
        <textarea
          rows={3}
          bind:this={el}
          bind:value
          on:blur={() => {
            gridViewStore.exitEditing()
          }}
          class={cn(
            $$restProps.class,
            "focus-visible:ring-ring h-full w-full rounded-none border px-2 text-xs outline-none focus:bg-white",
          )}
          on:change={() => {
            $updateCell.mutate({
              tableId,
              id: recordId,
              values: { [field.id.value]: value },
            })
          }}
        />
      </div>
    {:else if value}
      <div class="truncate">
        {value}
      </div>
    {/if}
  </div>
{/if}

<Dialog.Root
  bind:open
  onOpenChange={(open) => {
    if (!open) {
      $updateCell.mutate({
        tableId,
        id: recordId,
        values: { [field.id.value]: value },
      })
    }
  }}
>
  <Dialog.Content
    hideCloseButton
    class="flex h-[calc(100vh-200px)] max-w-3xl flex-col overflow-y-auto p-2 md:w-[1000px]"
  >
    <Tiptap {readonly} class="h-full flex-1" bind:value />
  </Dialog.Content>
</Dialog.Root>
