<script lang="ts">
  import type { RollupField } from "@undb/table"
  import { isNumber } from "radash"

  export let value: string | Array<string | null> | undefined = undefined
  export let field: RollupField

  $: fn = field.fn
</script>

<span class={$$restProps.class}>
  {#if value !== null}
    {#if fn === "lookup" && Array.isArray(value)}
      <div class="flex overflow-hidden">
        {#each value as item}
          {#if item !== null}
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
      </div>
    {:else if isNumber(value)}
      <span>
        {value}
      </span>
    {/if}
  {/if}
</span>
