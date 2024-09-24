<script lang="ts">
  import type { ReferenceField } from "@undb/table"
  import ForeignRecordsPickerDropdown from "../reference/foreign-records-picker-dropdown.svelte"
  import { Button } from "$lib/components/ui/button"

  export let value: string[] | null
  export let field: ReferenceField
  export let tableId: string
  export let recordId: string | undefined

  $: hasValue = Array.isArray(value) && value?.length > 0
</script>

<div class="flex gap-1 overflow-hidden">
  <ForeignRecordsPickerDropdown shouldUpdate {field} {tableId} {recordId} bind:isSelected={hasValue} let:builder>
    {#if hasValue}
      <Button size="xs" variant="link" class="px-0" builders={[builder]} on:click={(e) => e.stopPropagation()}>
        {value?.length} Linked Records
      </Button>
    {:else}
      <Button
        size="xs"
        variant="link"
        type="button"
        class="px-0"
        builders={[builder]}
        on:click={(e) => e.stopPropagation()}
      >
        + Link Records
      </Button>
    {/if}
  </ForeignRecordsPickerDropdown>
</div>
