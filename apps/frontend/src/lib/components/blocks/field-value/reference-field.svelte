<script lang="ts">
  import type { ReferenceField } from "@undb/table"
  import ForeignRecordsPickerDropdown from "../reference/foreign-records-picker-dropdown.svelte"
  import { Button } from "$lib/components/ui/button"

  export let value: string[]
  export let field: ReferenceField
  export let tableId: string
  export let recordId: string | undefined

  let hasValue = Array.isArray(value) && value.length > 0
</script>

<div class="flex gap-1 overflow-hidden px-2">
  <ForeignRecordsPickerDropdown shouldUpdate {field} {tableId} {recordId} bind:isSelected={hasValue}>
    {#if hasValue}
      <Button size="xs" variant="link">
        {value.length} Linked Records
      </Button>
    {:else}
      <Button size="xs" variant="link" type="button">+ Link Records</Button>
    {/if}
  </ForeignRecordsPickerDropdown>
</div>
