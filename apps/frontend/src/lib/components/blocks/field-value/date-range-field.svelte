<script lang="ts">
  import { cn } from "$lib/utils.js"
  import type { CreatedAtField, DateField, UpdatedAtField } from "@undb/table"

  export let value: [string | Date | undefined, string | Date | undefined] | undefined = undefined
  export let placeholder: string | undefined = undefined

  export let field: DateField | CreatedAtField | UpdatedAtField
  $: formatter = field.formatter
</script>

<div class={cn("text-sm", $$restProps.class)}>
  {#if !value?.[0] && !value?.[1]}
    {placeholder}
  {:else if value?.[0] && value?.[1]}
    {formatter(value[0])} - {formatter(value[1])}
  {:else if value?.[0]}
    {formatter(value[0])}
  {/if}
</div>
