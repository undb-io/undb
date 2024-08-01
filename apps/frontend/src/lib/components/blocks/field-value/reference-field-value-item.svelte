<script lang="ts">
  import { cn } from "$lib/utils"

  export let value: string
</script>

<span
  class={cn(
    "inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10",
    !value && "text-blue-400",
  )}
>
  {#if !value}
    Unamed Record
  {:else}
    {value}
  {/if}
  <slot />
</span>
