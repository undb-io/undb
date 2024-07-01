<script lang="ts">
  import { trpc } from "$lib/trpc/client"
  import { cn } from "$lib/utils"
  import { createMutation } from "@tanstack/svelte-query"
  import { NumberField } from "@undb/table"
  import { toast } from "svelte-sonner"

  export let tableId: string
  export let field: NumberField
  export let value: number
  export let isEditing: boolean
  export let recordId: string

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

  const onChange = (event: Event) => {
    value = +(event.target as HTMLInputElement).value
    $updateCell.mutate({
      tableId,
      id: recordId,
      values: { [field.id.value]: value },
    })
  }
</script>

{#if isEditing}
  <input
    bind:this={el}
    {...$$restProps}
    class={cn($$restProps.class, "focus-visible:ring-ring w-full rounded-none border-none outline-none focus:bg-white")}
    {value}
    on:change={onChange}
    type="number"
  />
{:else}
  <div class={$$restProps.class}>
    {value}
  </div>
{/if}
