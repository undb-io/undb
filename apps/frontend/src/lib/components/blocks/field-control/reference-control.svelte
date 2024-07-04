<script lang="ts">
  import type { ReferenceField } from "@undb/table"
  import ForeignRecordsPickerDropdown from "../reference/foreign-records-picker-dropdown.svelte"
  import { writable } from "svelte/store"
  import { Button } from "$lib/components/ui/button"
  import { onMount } from "svelte"

  export let tableId: string
  export let recordId: string | undefined
  export let readonly = false
  export let field: ReferenceField
  export let value: string[]

  let selected = writable<string[]>(value)

  onMount(() => {
    selected.set(value)
  })
  $: $selected, (value = $selected)

  let hasValue = Array.isArray($selected) && $selected.length > 0
  $: hasValueReactive = Array.isArray($selected) && $selected.length > 0
  $: if (hasValue && !hasValueReactive) {
    hasValue = hasValueReactive
  }
</script>

<div class="flex gap-1 overflow-hidden px-2">
  <ForeignRecordsPickerDropdown {readonly} {field} {tableId} {recordId} bind:isSelected={hasValue} bind:selected>
    {#if hasValueReactive}
      <Button size="xs" variant="link">
        {$selected.length} Linked Records
      </Button>
    {:else}
      <Button size="xs" variant="link" type="button">+ Link Records</Button>
    {/if}
  </ForeignRecordsPickerDropdown>
  {#if hasValueReactive}
    <ForeignRecordsPickerDropdown {field} {tableId} {recordId} bind:selected isSelected={false}>
      <Button variant="link" class="px-2" size="xs">+ Link Records</Button>
    </ForeignRecordsPickerDropdown>
  {/if}
</div>
