<script lang="ts">
  import { cn } from "$lib/utils"
  import type { IOption } from "@undb/table"
  import { getBgColor, getBorderColor, getRingColor, getTextColor } from "../grid-view/grid-view.util"

  export let option: IOption
</script>

<span
  data-option-id={option.id}
  class={cn(
    "inline-flex min-w-0 items-center justify-start overflow-hidden rounded-md border bg-gray-50 px-2 py-0.5 text-left text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10",
    getBgColor(option.color),
    getTextColor(option.color),
    getRingColor(option.color),
    getBorderColor(option.color),
    $$restProps.class,
  )}
>
  <span class="truncate">
    {option.name}
  </span>
</span>
