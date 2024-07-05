<script lang="ts">
  import type { ReferenceField } from "@undb/table"
  import ForeignRecordsPickerDropdown from "../../reference/foreign-records-picker-dropdown.svelte"
  import { Button } from "$lib/components/ui/button"
  import { writable } from "svelte/store"
  import { onMount } from "svelte"

  export let tableId: string
  export let field: ReferenceField
  export let value: string[] = []
  export let displayValue: string[]
  export let isEditing: boolean
  export let isSelected: boolean
  export let recordId: string

  let selected = writable<string[]>(value)

  onMount(() => {
    selected.set(value ?? [])
  })

  let hasValue = Array.isArray(value) && value.length > 0
  $: hasValueReactive = Array.isArray($selected) && $selected.length > 0
  $: if (hasValue && !hasValueReactive) {
    hasValue = hasValueReactive
  }
</script>

<div class={$$restProps.class}>
  <div class="flex w-full items-center justify-between gap-1">
    <div class="flex flex-1 items-center gap-1">
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
      <ForeignRecordsPickerDropdown shouldUpdate {field} {tableId} {recordId} bind:selected isSelected={false}>
        <Button variant="link" class="px-2">+</Button>
      </ForeignRecordsPickerDropdown>
    {/if}
  </div>
</div>
