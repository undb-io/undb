<script lang="ts">
  import { getTable } from "$lib/store/table.store"

  const table = getTable()
</script>

{#if $table}
  <iframe class="h-full w-full" src={`/openapi/tables/${$table.id.value}`} title={$table.name.value} frameborder="0"
  ></iframe>
{/if}
