<script lang="ts">
  import { cn } from "$lib/utils"
  import type { CurrencyField } from "@undb/table"

  export let value: number | undefined = undefined
  export let field: CurrencyField
</script>

<span class={cn($$restProps.class, "inline-flex items-center gap-1")}>
  <span>
    {field.symbol}
  </span>
  <span>
    {value}
  </span>
</span>
