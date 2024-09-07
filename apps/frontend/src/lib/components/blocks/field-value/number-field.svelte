<script lang="ts">
  import { cn } from "$lib/utils"
  import { isNumber } from "radash"

  export let value: number | undefined = undefined
</script>

{#if isNumber(value)}
  <span class={cn("text-muted-foreground text-sm", $$restProps.class)}>{value}</span>
{/if}
