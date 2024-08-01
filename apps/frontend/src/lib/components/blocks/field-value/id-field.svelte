<script lang="ts">
  import { cn } from "$lib/utils"

  export let value: string
</script>

<div class={$$restProps.class}>
  <span
    class={cn(
      "me-2 rounded bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    )}
  >
    {value}
  </span>
</div>
