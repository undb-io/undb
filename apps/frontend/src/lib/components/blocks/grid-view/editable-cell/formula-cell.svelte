<script lang="ts">
  import { cn } from "$lib/utils"
  import type { FormulaField } from "@undb/table"
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte"

  export let value: string | number
  export let field: FormulaField
  let returnType = field.returnType
</script>

<div class={cn("truncate", $$restProps.class)}>
  {#if returnType === "boolean"}
    <Checkbox checked={value === 1} disabled />
  {:else if value !== undefined && value !== null}
    {value}
  {/if}
</div>
