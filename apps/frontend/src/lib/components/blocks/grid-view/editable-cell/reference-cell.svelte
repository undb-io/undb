<script lang="ts">
  import type { ReferenceField } from "@undb/table"
  import ReferenceFieldValueItem from "../../field-value/reference-field-value-item.svelte"
  import ForeignRecordsPickerDropdown from "../../reference/foreign-records-picker-dropdown.svelte"

  export let tableId: string
  export let field: ReferenceField
  export let value: string[]
  export let displayValue: string[]
  export let isEditing: boolean
  export let recordId: string

  $: displayValues = Object.values(displayValue).flat()
</script>

<div class={$$restProps.class}>
  {#if displayValues.length}
    <div class="flex items-center gap-2">
      {#each displayValues as value}
        <ReferenceFieldValueItem {value} />
      {/each}
    </div>
  {:else}
    <ForeignRecordsPickerDropdown {field} {tableId} {recordId} bind:value />
  {/if}
</div>
