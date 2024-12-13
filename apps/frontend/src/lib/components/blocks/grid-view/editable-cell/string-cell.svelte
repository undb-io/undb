<script lang="ts">
  import { cn } from "$lib/utils"
  import { createMutation } from "@tanstack/svelte-query"
  import type { StringField } from "@undb/table"
  import { toast } from "svelte-sonner"
  import { gridViewStore } from "../grid-view.store"
  import { getDataService } from "$lib/store/data-service.store"

  export let tableId: string
  export let field: StringField
  export let value: string
  export let recordId: string
  export let isEditing: boolean
  export let readonly: boolean
  export let onValueChange: (value: string) => void

  const dataService = getDataService()

  const updateCell = createMutation({
    mutationKey: ["record", tableId, field.id.value, recordId],
    mutationFn: dataService.records.updateRecord,
    onSuccess(data, variables, context) {
      el?.blur()
      gridViewStore.exitEditing()
      onValueChange(value)
    },
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
    on:change={() => {
      $updateCell.mutate({
        tableId,
        id: recordId,
        values: { [field.id.value]: value },
      })
    }}
  />
{:else}
  <div class={cn("truncate", $$restProps.class)}>
    {#if value}
      {value}
    {/if}
  </div>
{/if}
