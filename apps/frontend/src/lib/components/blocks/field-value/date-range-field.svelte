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
    <span class="flex items-center gap-1">
      <span class="rounded-sm border bg-gray-50 px-1 py-0.5">
        {formatter(value[0])}
      </span>
      <span class="mx-1 text-xs text-gray-500"> - </span>
      <span class="rounded-sm border bg-gray-50 px-1 py-0.5">
        {formatter(value[1])}
      </span>
    </span>
  {:else if value?.[0]}
    <span class="rounded-sm border bg-gray-50 px-1 py-0.5">
      {formatter(value[0])}
    </span>
  {/if}
</div>
