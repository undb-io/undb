<script lang="ts">
  import { cn } from "$lib/utils"
  import { createMutation } from "@tanstack/svelte-query"
  import { NumberField } from "@undb/table"
  import { toast } from "svelte-sonner"
  import { debounce, isNumber } from "radash"
  import { gridViewStore } from "../grid-view.store"
  import { Slider } from "$lib/components/ui/slider"
  import * as Tooltip from "$lib/components/ui/tooltip"
  import { getDataService } from "$lib/store/data-service.store"

  export let tableId: string
  export let field: NumberField
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

  const onChange = (nums: number[]) => {
    const value = nums[0] / 100
    onValueChange(value)
    $updateCell.mutate({
      tableId,
      id: recordId,
      values: { [field.id.value]: value },
    })
  }
</script>

<Tooltip.Root>
  <Tooltip.Trigger class="w-full">
    <div class={$$restProps.class}>
      {#if isEditing}
        <Slider value={[(value ?? 0) * 100]} onValueChange={debounce({ delay: 300 }, onChange)} />
      {:else if isNumber(value) || value === undefined || value === null}
        <Slider disabled value={[value * 100]} />
      {/if}
    </div>
  </Tooltip.Trigger>
  <Tooltip.Content>
    <p>{value}</p>
  </Tooltip.Content>
</Tooltip.Root>
