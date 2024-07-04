<script lang="ts">
  import type { ReferenceField } from "@undb/table"
  import ForeignRecordsPickerDropdown from "../../reference/foreign-records-picker-dropdown.svelte"
  import { Button } from "$lib/components/ui/button"

  export let tableId: string
  export let field: ReferenceField
  export let value: string[]
  export let displayValue: string[]
  export let isEditing: boolean
  export let isSelected: boolean
  export let recordId: string

  let hasValue = Array.isArray(value) && value.length > 0
  $: hasValueReactive = Array.isArray(value) && value.length > 0
  $: if (hasValue && !hasValueReactive) {
    hasValue = hasValueReactive
  }
</script>

<div class={$$restProps.class}>
  <div class="flex w-full items-center justify-between gap-1">
    <div class="flex flex-1 items-center gap-1">
      <ForeignRecordsPickerDropdown
        onOpenChange={(open) => {
          if (!open) {
            hasValue = hasValueReactive
          }
        }}
        isSelected={hasValue}
        {field}
        {tableId}
        {recordId}
        bind:value
      >
        {#if hasValueReactive}
          <Button size="xs" variant="link">
            {value.length} Linked Records
          </Button>
        {:else}
          <Button size="xs" variant="link" type="button">+ Link Records</Button>
        {/if}
      </ForeignRecordsPickerDropdown>
    </div>

    {#if (isSelected || isEditing) && hasValueReactive}
      <ForeignRecordsPickerDropdown {field} {tableId} {recordId} bind:value>
        <Button variant="link" class="px-2">+</Button>
      </ForeignRecordsPickerDropdown>
    {/if}
  </div>
</div>
