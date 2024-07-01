<script lang="ts">
  import { trpc } from "$lib/trpc/client"
  import { cn } from "$lib/utils"
  import { createMutation } from "@tanstack/svelte-query"
  import type { StringField } from "@undb/table"
  import { toast } from "svelte-sonner"

  export let tableId: string
  export let field: StringField
  export let value: string
  export let recordId: string
  export let isEditing: boolean

  const updateCell = createMutation({
    mutationKey: ["record", tableId, field.id.value, recordId],
    mutationFn: trpc.record.update.mutate,
    onError(error: Error) {
      toast.error(error.message)
    },
  })

  let el: HTMLInputElement
  $: if (isEditing) {
    if (el) {
      el.focus()
    }
  }
</script>

{#if isEditing}
  <input
    bind:this={el}
    bind:value
    class={cn(
      $$restProps.class,
      "focus-visible:ring-ring w-full rounded-none border-none px-2  text-xs outline-none focus:bg-white",
    )}
    on:change={() =>
      $updateCell.mutate({
        tableId,
        id: recordId,
        values: { [field.id.value]: value },
      })}
  />
{:else}
  <div class={$$restProps.class}>
    {value}
  </div>
{/if}
