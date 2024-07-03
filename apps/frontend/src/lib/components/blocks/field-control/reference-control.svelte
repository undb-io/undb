<script lang="ts">
  import type { ReferenceField } from "@undb/table"
  import ForeignRecordsPickerDropdown from "../reference/foreign-records-picker-dropdown.svelte"
  import IdField from "../field-value/id-field.svelte"

  export let tableId: string
  export let recordId: string | undefined
  export let readonly = false
  export let field: ReferenceField
  export let value: string[]
</script>

<div class="flex gap-1 overflow-hidden px-2">
  {#if Array.isArray(value)}
    {#each value as id}
      <div class="flex items-center gap-2">
        <IdField value={id} />
      </div>
    {/each}
  {/if}
  <ForeignRecordsPickerDropdown {readonly} {field} {tableId} {recordId} bind:value />
</div>
