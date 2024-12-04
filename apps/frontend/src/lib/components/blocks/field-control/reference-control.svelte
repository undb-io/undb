<script lang="ts">
  import type { ReferenceField } from "@undb/table"
  import ForeignRecordsPickerDropdown from "../reference/foreign-records-picker-dropdown.svelte"
  import { writable, type Writable } from "svelte/store"
  import { Button } from "$lib/components/ui/button"
  import { onMount } from "svelte"
  import { LL } from "@undb/i18n/client"

  export let tableId: string
  export let recordId: string | undefined
  export let readonly = false
  export let field: ReferenceField
  export let value: string[]
  export let r: Writable<string | null>
  export let onValueChange: (value: string[]) => void

  let selected = writable<string[]>(value)

  onMount(() => {
    selected?.set(value)
  })
  $: $selected, (value = $selected)

  let hasValue = Array.isArray($selected) && $selected.length > 0
  $: hasValueReactive = Array.isArray($selected) && $selected.length > 0
  $: if (hasValue && !hasValueReactive) {
    hasValue = hasValueReactive
  }
</script>

<div class="flex gap-1 overflow-hidden">
  <ForeignRecordsPickerDropdown
    let:builder
    {r}
    {readonly}
    {field}
    {tableId}
    {recordId}
    bind:isSelected={hasValue}
    bind:selected
    {onValueChange}
  >
    {#if hasValueReactive}
      <Button size="xs" variant="link" class="px-0" builders={[builder]}>
        {$LL.table.record.reference.linked({ n: $selected?.length })}
      </Button>
    {:else}
      <Button size="xs" variant="link" type="button" class="text-muted-foreground px-0" builders={[builder]}>
        + {$LL.table.record.reference.link()}
      </Button>
    {/if}
  </ForeignRecordsPickerDropdown>
  {#if hasValueReactive && !readonly}
    <ForeignRecordsPickerDropdown
      {onValueChange}
      {r}
      {field}
      {tableId}
      {recordId}
      bind:selected
      isSelected={false}
      let:builder
    >
      <Button variant="link" class="px-2" size="xs" builders={[builder]}>+ {$LL.table.record.reference.link()}</Button>
    </ForeignRecordsPickerDropdown>
  {/if}
</div>
