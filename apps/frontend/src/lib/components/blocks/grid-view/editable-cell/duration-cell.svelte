<script lang="ts">
  import { trpc } from "$lib/trpc/client"
  import { cn } from "$lib/utils"
  import { createMutation } from "@tanstack/svelte-query"
  import { DurationField, millisecondsToDuration } from "@undb/table"
  import { toast } from "svelte-sonner"
  import { debounce, isNumber } from "radash"
  import { gridViewStore } from "../grid-view.store"
  import DurationInput from "$lib/components/blocks/duration/duration-input.svelte"
  import { getIsLocal, getDataService } from "$lib/store/data-service.store"
  import { getIsPlayground } from "$lib/store/playground.svelte"
  import { type IUpdateRecordCommand } from "@undb/commands"

  export let tableId: string
  export let field: DurationField
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
      gridViewStore.exitEditing()
    },
    onError(error: Error) {
      toast.error(error.message)
    },
  })

  const onChange = (value: number) => {
    onValueChange(value)
    $updateCell.mutate({
      tableId,
      id: recordId,
      values: { [field.id.value]: value },
    })
  }
</script>

{#if isEditing}
  <DurationInput
    onValueChange={debounce({ delay: 300 }, onChange)}
    max={field.max}
    min={field.min}
    autofocus
    class={cn($$restProps.class, "focus-visible:ring-ring w-full rounded-none border-none outline-none focus:bg-white")}
    {value}
  />
{:else}
  <div class={$$restProps.class}>
    {#if isNumber(value)}
      {millisecondsToDuration(value)}
    {/if}
  </div>
{/if}
