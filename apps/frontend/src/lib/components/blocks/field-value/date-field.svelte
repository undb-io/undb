<script lang="ts">
  import { cn } from "$lib/utils"
  import type { CreatedAtField, DateField, UpdatedAtField } from "@undb/table"

  export let value: string | Date | undefined = undefined
  export let placeholder: string | undefined = undefined

  export let field: DateField | CreatedAtField | UpdatedAtField
  let formatter = field.formatter

  $: formattedValue = value ? formatter(value) : ""
  $: displayValue = formattedValue ?? placeholder ?? ""
</script>

{#if displayValue}
  <div class={cn("text-muted-foreground text-sm", $$restProps.class)}>{displayValue}</div>
{/if}
