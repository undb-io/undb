<script lang="ts">
  import type { Field } from "@undb/table"
  import DateRangeFieldFilterOption from "./variants/date-range-field-filter-option.svelte"
  export let field: Field | undefined
  export let option: any
</script>

{#if field?.type === "dateRange"}
  <DateRangeFieldFilterOption {field} bind:option class={$$restProps.class} />
{/if}
