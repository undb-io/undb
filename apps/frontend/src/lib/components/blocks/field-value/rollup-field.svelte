<script lang="ts">
  import { cn } from "$lib/utils"
  import type { RollupField } from "@undb/table"
  import { isNumber } from "radash"

  export let value: string | Array<string | null>
  export let field: RollupField

  $: fn = field.fn
</script>

<div class={cn($$restProps.class, "flex-1 overflow-auto")}>
  {#if !!value}
    {#if fn === "lookup" && Array.isArray(value)}
      <div class="flex overflow-x-auto">
        {#if !value.length}
          <span
            class="text-muted-foreground me-2 rounded px-1 py-0.5 text-xs font-medium dark:bg-gray-700 dark:text-gray-300"
          >
            -
          </span>
        {:else}
          {#each value as item}
            {#if !!item}
              <span
                class="me-2 rounded bg-gray-200 px-1 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300"
              >
                {item}
              </span>
            {:else}
              <span
                class="text-muted-foreground me-2 rounded bg-gray-200 px-1 py-0.5 text-xs font-medium dark:bg-gray-700 dark:text-gray-300"
              >
                Unamed
              </span>
            {/if}
          {/each}
        {/if}
      </div>
    {:else if isNumber(value)}
      <span class="text-xs font-medium">
        {value}
      </span>
    {/if}
  {:else}
    <span
      class="text-muted-foreground me-2 rounded px-1 py-0.5 text-xs font-medium dark:bg-gray-700 dark:text-gray-300"
    >
      -
    </span>
  {/if}
</div>
