<script lang="ts">
  import type { Field } from "@undb/table"
  import FieldControl from "../field-control/field-control.svelte"
  import Input from "$lib/components/ui/input/input.svelte"
  import { cn } from "$lib/utils"
  import { writable } from "svelte/store"
  import { getTable } from "$lib/store/table.store"

  const table = getTable()

  export let field: Field | undefined
  export let recordId: string | undefined = undefined
  export let value: any | undefined = undefined
  export let displayValue: any | undefined = undefined

  const className = cn("h-8 rounded-l-none border-l-0 py-0", $$restProps.class)
</script>

{#if field}
  <FieldControl
    bind:value
    autofocus
    {displayValue}
    {field}
    tableId={$table.id.value}
    {recordId}
    {...$$restProps}
    class={cn(className, $$restProps.class)}
  />
{/if}
