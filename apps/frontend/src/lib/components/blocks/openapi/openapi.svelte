<script lang="ts">
  import { getBaseById } from "$lib/store/base.store"
  import { getTable } from "$lib/store/table.store"

  const table = getTable()
  $: base = $getBaseById($table.baseId)
</script>

{#if $table && base}
  <iframe
    class="h-full w-full"
    src={`/api/bases/${base?.name}/tables/${$table.name.value}`}
    title={$table.name.value}
    frameborder="0"
  >
  </iframe>
{/if}
