<script lang="ts">
  import { cn } from "$lib/utils"

  export let value: string | undefined = undefined
  export let placeholder: string | undefined = undefined

  $: v = value || placeholder || ""
</script>

{#if v}
  <div class={cn("truncate text-left text-sm", $$restProps.class)}>
    {v}
  </div>
{/if}
