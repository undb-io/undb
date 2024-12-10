<script lang="ts">
  import { trpc } from "$lib/trpc/client"
  import { cn } from "$lib/utils"
  import { createMutation } from "@tanstack/svelte-query"
  import { NumberField } from "@undb/table"
  import { toast } from "svelte-sonner"
  import { debounce, isNumber } from "radash"
  import { gridViewStore } from "../grid-view.store"
  import { getIsLocal, getDataService } from "$lib/store/data-service.store"
  import { getIsPlayground } from "$lib/store/playground.svelte"
  import { type IUpdateRecordCommand } from "@undb/commands"

  export let tableId: string
  export let field: NumberField
  export let value: number
  export let isEditing: boolean
  export let recordId: string
  export let onValueChange: (value: number) => void

  const isLocal = getIsLocal()
  const isPlayground = getIsPlayground()

  const updateCell = createMutation({
    mutationKey: ["record", tableId, field.id.value, recordId],
    mutationFn: async (command: IUpdateRecordCommand) => {
      const dataService = await getDataService(isLocal, isPlayground)
      return dataService.records.updateRecord(command)
    },
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
      {value}
    {/if}
  </div>
{/if}
