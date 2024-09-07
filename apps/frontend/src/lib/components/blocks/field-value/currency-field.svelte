<script lang="ts">
  import { cn } from "$lib/utils"
  import type { CurrencyField } from "@undb/table"
  import { isNumber } from "radash"

  export let value: number | undefined = undefined
  export let field: CurrencyField
</script>

<span class={cn($$restProps.class, "inline-flex items-center gap-1 text-sm")}>
  {#if isNumber(value)}
    <span>
      {field.symbol}
    </span>
    <span>
      {value}
    </span>
  {/if}
</span>
