<script lang="ts">
  import { trpc } from "$lib/trpc/client"
  import { cn } from "$lib/utils"
  import { createMutation } from "@tanstack/svelte-query"
  import { DurationField, millisecondsToDuration } from "@undb/table"
  import { toast } from "svelte-sonner"
  import { debounce, isNumber } from "radash"
  import { gridViewStore } from "../grid-view.store"
  import DurationInput from "$lib/components/blocks/duration/duration-input.svelte"

  export let tableId: string
  export let field: DurationField
  export let value: number
  export let isEditing: boolean
  export let recordId: string
  export let onValueChange: (value: number) => void

  const updateCell = createMutation({
    mutationKey: ["record", tableId, field.id.value, recordId],
    mutationFn: trpc.record.update.mutate,
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
