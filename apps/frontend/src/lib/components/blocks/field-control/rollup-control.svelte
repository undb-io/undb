<script lang="ts">
  import type { IRollupFieldValue } from "@undb/table"
  import RollupField from "../field-value/rollup-field.svelte"

  export let value: IRollupFieldValue
  export let field: RollupField
</script>

<div {...$$restProps}></div>
{#if Array.isArray(value)}
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
{:else}
  <span class="text-xs">
    {value}
  </span>
{/if}
