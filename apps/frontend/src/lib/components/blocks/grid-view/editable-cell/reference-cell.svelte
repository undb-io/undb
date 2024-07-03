<script lang="ts">
  import type { ReferenceField } from "@undb/table"
  import ReferenceFieldValueItem from "../../field-value/reference-field-value-item.svelte"
  import ForeignRecordsPickerDropdown from "../../reference/foreign-records-picker-dropdown.svelte"
  import { PlusIcon, XIcon } from "lucide-svelte"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { toast } from "svelte-sonner"

  export let tableId: string
  export let field: ReferenceField
  export let value: string[]
  export let displayValue: string[]
  export let isEditing: boolean
  export let isSelected: boolean
  export let recordId: string

  $: displayValues = Object.values(displayValue).flat()

  const updateCell = createMutation({
    mutationKey: ["record", tableId, field.id.value, recordId],
    mutationFn: trpc.record.update.mutate,
    onError(error: Error) {
      toast.error(error.message)
    },
  })

  const remove = (index: number) => {
    const newValue = [...value]
    newValue.splice(index, 1)
    value = newValue

    $updateCell.mutate({
      tableId,
      id: recordId,
      values: {
        [field.id.value]: newValue,
      },
    })
  }
</script>

<div class={$$restProps.class}>
  {#if Array.isArray(value) && value?.length}
    <div class="flex w-full items-center justify-between">
      <div class="flex flex-1 items-center gap-1">
        {#each value as v, i}
          {@const displayValue = displayValues[i]}
          <ReferenceFieldValueItem value={displayValue}>
            {#if isEditing || isSelected}
              <button on:click={() => remove(i)}>
                <XIcon class="h-3 w-3" />
              </button>
            {/if}
          </ReferenceFieldValueItem>
        {/each}
      </div>

      {#if isSelected || isEditing}
        <ForeignRecordsPickerDropdown {field} {tableId} {recordId} bind:value>
          <button class="flex h-4 w-4 items-center justify-center rounded-sm border border-blue-100 bg-blue-50">
            <PlusIcon class="h-3 w-3 text-blue-400" />
          </button>
        </ForeignRecordsPickerDropdown>
      {/if}
    </div>
  {:else}
    <ForeignRecordsPickerDropdown {field} {tableId} {recordId} bind:value />
  {/if}
</div>
