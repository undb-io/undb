<script lang="ts">
  import { cn } from "$lib/utils"

  export let value: string | undefined = undefined
  export let displayValue: string | undefined = undefined
</script>

<span
  data-field-value={value}
  class={cn(
    "inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10",
    $$restProps.class,
  )}
>
  {displayValue}
</span>
