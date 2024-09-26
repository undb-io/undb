<script lang="ts">
  import type { ReferenceField } from "@undb/table"
  import ForeignRecordsPickerDropdown from "../reference/foreign-records-picker-dropdown.svelte"
  import { Button } from "$lib/components/ui/button"
  import { writable } from "svelte/store"

  export let value: string[] | null
  export let field: ReferenceField
  export let tableId: string
  export let recordId: string | undefined

  $: selected = writable<string[]>(value ?? [])

  let hasValue = Array.isArray(value) && value.length > 0

  $: selected, (hasValue = Array.isArray(value) && value.length > 0)

  $: hasValueReactive = Array.isArray($selected) && $selected.length > 0
  $: if (hasValue && !hasValueReactive) {
    hasValue = hasValueReactive
  }
</script>

<div class="flex gap-1 overflow-hidden">
  <ForeignRecordsPickerDropdown
    shouldUpdate
    onOpenChange={(open) => {
      if (!open) {
        hasValue = hasValueReactive
      }
    }}
    {field}
    {tableId}
    {recordId}
    bind:isSelected={hasValue}
    bind:selected
    let:builder
  >
    {#if hasValueReactive}
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
