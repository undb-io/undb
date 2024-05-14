<script lang="ts">
  import type { Field } from "@undb/table"
  import FieldControl from "../field-control/field-control.svelte"
  import Input from "$lib/components/ui/input/input.svelte"
  import { cn } from "$lib/utils"

  export let field: Field | undefined
  export let op: string | undefined
  export let value: any | undefined = undefined
  $: hasValue = op ? field?.isOpHasValue(op) ?? false : false

  $: if (!hasValue) {
    value = undefined
  }

  const className = cn("h-8 rounded-l-none border-l-0 py-0", $$restProps.class)
</script>

{#if field}
  <FieldControl bind:value {field} class={className} />
{:else}
  <Input disabled class={className} placeholder="select a field" />
{/if}
