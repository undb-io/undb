<script lang="ts">
  import type { Props } from "./index.js"
  import * as Popover from "$lib/components/ui/popover"
  import { ChevronDownIcon } from "lucide-svelte"
  import { COLORS, type IColors } from "@undb/table"
  import ColorItem from "./color-item.svelte"
  import { cn } from "$lib/utils.js"

  type $$Props = Props

  export let value: IColors | undefined = undefined
  export let disabled: boolean = false

  $: if (!value) {
    value = COLORS[0]
    onColorChange?.(value)
  }

  export let onColorChange: $$Props["onColorChange"] = undefined

  let open = false
</script>

<Popover.Root openFocus bind:open portal="body">
  <Popover.Trigger {disabled}>
    <ColorItem {value} class="flex items-center justify-center">
      <ChevronDownIcon class={cn("h-4 w-4", value ? "text-white" : "text-black")} />
    </ColorItem>
  </Popover.Trigger>
  <Popover.Content class="w-auto p-0">
    <div class="grid grid-cols-4 gap-2 p-2">
      {#each COLORS as color}
        <ColorItem
          on:click={() => {
            onColorChange?.(color)
            open = false
          }}
          value={color}
        />
      {/each}
    </div>
  </Popover.Content>
</Popover.Root>
