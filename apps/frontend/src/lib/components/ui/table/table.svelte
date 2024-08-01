<script lang="ts">
  import type { HTMLTableAttributes } from "svelte/elements"
  import { cn } from "$lib/utils.js"

  type $$Props = HTMLTableAttributes

  let className: $$Props["class"] = undefined
  export { className as class }
</script>

<table class={cn("w-full caption-bottom text-sm", className)} {...$$restProps}>
  <slot />
</table>
