<script lang="ts">
  import type { RollupField } from "@undb/table"
  import { isNumber } from "radash"

  export let value: string | Array<string | null> | undefined = undefined
  export let field: RollupField

  $: fn = field.fn
</script>

{#if value !== null}
  <span class={$$restProps.class}>
    {#if fn === "lookup" && Array.isArray(value)}
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
    {:else if isNumber(value)}
      <span>
        {value}
      </span>
    {/if}
  </span>
{/if}
