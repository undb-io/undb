<script lang="ts">
  import { cn } from "$lib/utils"
  import type { IColors } from "@undb/table"

  export let value: IColors | undefined = undefined

  const colorsMap: Record<IColors, string> = {
    red: "bg-red-500",
    green: "bg-green-500",
    blue: "bg-blue-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    black: "bg-black",
    cyan: "bg-cyan-500",
    gray: "bg-gray-500",
    indigo: "bg-indigo-500",
    pink: "bg-pink-500",
    teal: "bg-teal-500",
    orange: "bg-orange-500",
  }
</script>

<button
  on:click
  class={cn(
    "flex h-6 w-6 items-center justify-center rounded-sm bg-white",
    $$restProps.class,
    value ? colorsMap[value] : "border bg-white",
  )}
>
  <slot />
</button>
