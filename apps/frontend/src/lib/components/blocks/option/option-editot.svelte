<script lang="ts">
  import { cn } from "$lib/utils"
  import type { IColors, IOptionName } from "@undb/table"
  import { getColor } from "../grid-view/grid-view.util"
  import { Input } from "$lib/components/ui/input"

  export let color: IColors
  export let name: IOptionName
</script>

<div class="flex items-center gap-2">
  <span class={cn("h-5 w-5 rounded-sm", getColor(color))}> </span>
  <Input bind:value={name} />
</div>
