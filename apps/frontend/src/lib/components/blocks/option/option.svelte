<script lang="ts">
  import { cn } from "$lib/utils"
  import type { IOption } from "@undb/table"
  import { getBgColor, getRingColor, getTextColor } from "../grid-view/grid-view.util"

  export let option: IOption
</script>

<span
  data-option-id={option.id}
  class={cn(
    "inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10",
    getBgColor(option.color),
    getTextColor(option.color),
    getRingColor(option.color),
  )}
>
  {option.name}
</span>
