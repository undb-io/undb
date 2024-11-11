<script lang="ts">
  import type { IDateFieldMacro } from "@undb/table"

  export let value: IDateFieldMacro | undefined = undefined
</script>

{#if value}
  <span class="rounded-md border-blue-200 bg-blue-100 px-1 py-0.5 text-xs text-blue-500">{value}</span>
{/if}
