<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { cn } from "$lib/utils"
  import type { RollupField } from "@undb/table"
  import { Maximize2Icon } from "lucide-svelte"
  import { isNumber } from "radash"
  import * as Popover from "$lib/components/ui/popover"

  export let value: string | Array<string | null>
  export let displayValue: string | null
  export let field: RollupField
  export let isEditing: boolean
  export let isSelected: boolean

  $: fn = field.fn
</script>

<div class={$$restProps.class}>
  <div class={cn("flex-1 overflow-hidden", (isSelected || isEditing) && "")}>
    {#if !!value}
      {#if fn === "lookup" && Array.isArray(value)}
        <div class="flex overflow-hidden">
          {#each value as item}
            {#if !!item}
              <span
                class="me-2 min-w-8 truncate rounded bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300"
              >
                {item}
              </span>
            {:else}
              <span
                class="text-muted-foreground me-2 rounded bg-gray-200 px-2 py-0.5 text-xs font-medium dark:bg-gray-700 dark:text-gray-300"
              >
                Unamed
              </span>
            {/if}
          {/each}
        </div>
      {:else if isNumber(value)}
        <span>
          {value}
        </span>
      {/if}
    {/if}
  </div>
  {#if (isSelected || isEditing) && ((!Array.isArray(value) && !!value) || (Array.isArray(value) && value.length)) && field.fn === "lookup"}
    <Popover.Root>
      <Popover.Trigger asChild let:builder>
        <Button builders={[builder]} variant="link" class="min-w-4 pl-2 pr-0">
          <Maximize2Icon class="text-muted-foreground h-3 w-3" />
        </Button>
      </Popover.Trigger>
      <Popover.Content class="grid max-h-[300px] w-[300px] gap-2 overflow-y-auto p-1.5">
        {#if Array.isArray(value)}
          {#each value as item}
            {#if !!item}
              <span
                class="me-2 min-w-8 truncate rounded bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300"
              >
                {item}
              </span>
            {:else}
              <span
                class="text-muted-foreground me-2 rounded bg-gray-100 px-2 py-1 text-xs font-medium dark:bg-gray-700 dark:text-gray-300"
              >
                Unamed
              </span>
            {/if}
          {/each}
        {/if}
      </Popover.Content>
    </Popover.Root>
  {/if}
</div>
