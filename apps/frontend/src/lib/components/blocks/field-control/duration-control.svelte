<script lang="ts">
  import { cn } from "$lib/utils"
  import DurationInput from "$lib/components/blocks/duration/duration-input.svelte"

  export let readonly = false
  export let value: number
  export let onValueChange: (value: number) => void
</script>

<DurationInput
  bind:value
  disabled={readonly}
  {...$$restProps}
  class={cn(
    "border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
    $$restProps.class,
  )}
  on:change={(e) => onValueChange?.(e.target.value)}
/>
