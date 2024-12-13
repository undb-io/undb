<script lang="ts">
  import { cn } from "$lib/utils"
  import { createMutation } from "@tanstack/svelte-query"
  import { CurrencyField } from "@undb/table"
  import { toast } from "svelte-sonner"
  import { debounce, isNumber } from "radash"
  import { gridViewStore } from "../grid-view.store"
  import { getDataService } from "$lib/store/data-service.store"

  export let tableId: string
  export let field: CurrencyField
  export let value: number
  export let isEditing: boolean
  export let recordId: string
  export let onValueChange: (value: number) => void

  const dataService = getDataService()

  const updateCell = createMutation({
    mutationKey: ["record", tableId, field.id.value, recordId],
    mutationFn: dataService.records.updateRecord,
    onSuccess(data, variables, context) {
      el?.blur()
      gridViewStore.exitEditing()
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

  const onChange = (event: Event) => {
    value = +(event.target as HTMLInputElement).value
    onValueChange(value)
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
    max={field.max}
    min={field.min}
    class={cn($$restProps.class, "focus-visible:ring-ring w-full rounded-none border-none outline-none focus:bg-white")}
    {value}
    on:change={debounce({ delay: 300 }, onChange)}
    type="number"
  />
{:else}
  <div class={$$restProps.class}>
    {#if isNumber(value)}
      {field.symbol}
      {value}
    {/if}
  </div>
{/if}
