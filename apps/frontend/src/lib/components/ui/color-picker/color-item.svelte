<script lang="ts">
  import { cn } from "$lib/utils"
  import type { IColors } from "@undb/table"

  export let value: IColors | undefined = undefined

  const colorsMap: Record<IColors, string> = {
    red: "bg-red-300",
    green: "bg-green-300",
    blue: "bg-blue-300",
    yellow: "bg-yellow-300",
    purple: "bg-purple-300",
    black: "bg-black",
    cyan: "bg-cyan-300",
    gray: "bg-gray-300",
    indigo: "bg-indigo-300",
    pink: "bg-pink-300",
    teal: "bg-teal-300",
    orange: "bg-orange-300",
    lime: "bg-lime-300",
    emerald: "bg-emerald-300",
    sky: "bg-sky-300",
    violet: "bg-violet-300",
    rose: "bg-rose-300",
  }

  const textColorMap: Record<IColors, string> = {
    red: "text-red-500",
    green: "text-green-500",
    blue: "text-blue-500",
    yellow: "text-yellow-500",
    purple: "text-purple-500",
    black: "text-black",
    lime: "text-lime-500",
    emerald: "text-emerald-500",
    sky: "text-sky-500",
    violet: "text-violet-500",
    rose: "text-rose-500",
    cyan: "text-cyan-500",
    gray: "text-gray-500",
    indigo: "text-indigo-500",
    pink: "text-pink-500",
    teal: "text-teal-500",
    orange: "text-orange-500",
  }
</script>

<button
  type="button"
  on:click
  class={cn(
    "flex h-6 w-6 items-center justify-center rounded-sm bg-white",
    $$restProps.class,
    value ? colorsMap[value] : "border bg-white",
    value ? textColorMap[value] : "text-black",
  )}
>
  <slot />
</button>
