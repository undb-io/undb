<script lang="ts">
  import { cn } from "$lib/utils"
  import { FormulaField } from "@undb/table"
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte"

  export let value: string | number | undefined = undefined
  export let placeholder: string | undefined = undefined

  export let field: FormulaField

  $: v = value || placeholder || ""
</script>

{#if v !== undefined && v !== null}
  <div class={cn("truncate text-left text-sm", $$restProps.class)}>
    {#if field.returnType === "boolean"}
      <Checkbox checked={v === 1} disabled />
    {:else}
      {v}
    {/if}
  </div>
{/if}
