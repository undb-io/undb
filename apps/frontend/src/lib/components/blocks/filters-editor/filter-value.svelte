<script lang="ts">
  import type { Field } from "@undb/table"
  import FieldControl from "../field-control/field-control.svelte"
  import Input from "$lib/components/ui/input/input.svelte"
  import { cn } from "$lib/utils"
  import { writable } from "svelte/store"
  import { getTable } from "$lib/store/table.store"

  const table = getTable()

  export let field: Field | undefined
  export let recordId: string
  export let op: string | undefined
  export let value: any | undefined = undefined
  export let displayValue: any | undefined = undefined
  let hasValue = writable(true)

  function updateHasValue() {
    hasValue.set(!!op && !!field?.isOpHasValue(op))
  }
  $: op, field, updateHasValue()

  $: if (!$hasValue) {
    value = undefined
  }

  const className = cn("h-8 rounded-l-none border-l-0 py-0", $$restProps.class)
</script>

{#if $hasValue}
  {#if field}
    <FieldControl
      bind:value
      {displayValue}
      {field}
      tableId={$table.id.value}
      {recordId}
      {...$$restProps}
      class={cn(className, $$restProps.class)}
    />
  {:else if $hasValue}
    <Input disabled class={className} placeholder="select a field" />
  {/if}
{/if}
