<script lang="ts">
  import { cn } from "$lib/utils"

  export let value: number | undefined = undefined
</script>

{#if value}
  <span class={cn($$restProps.class, "text-sm")}>
    {value}
  </span>
{/if}
