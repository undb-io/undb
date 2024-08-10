<script lang="ts">
  import { cn } from "$lib/utils"

  export let value: string | undefined = undefined
  export let placeholder: string | undefined = undefined
</script>

{#if !value}
  <div>
    {placeholder || ""}
  </div>
{:else}
  <a
    href={value}
    class={cn("font-medium text-blue-600 underline hover:no-underline dark:text-blue-500", $$restProps.class)}
  >
    <span>{value}</span>
  </a>
{/if}
