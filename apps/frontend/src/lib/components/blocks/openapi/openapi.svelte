<script lang="ts">
  import { page } from "$app/stores"
  import { getBaseById, bases } from "$lib/store/base.store"
  import { getTable } from "$lib/store/table.store"

  const table = getTable()
  $: base = $getBaseById($table.baseId)
  $: viewId = $page.params.viewId
  $: view = $table.views.getViewById(viewId)
</script>

{#if $table && base}
  <iframe
    class="h-full w-full"
    src={`/api/bases/${base?.name}/tables/${$table.name.value}?view=${view?.name.value}`}
    title={$table.name.value}
    frameborder="0"
  >
  </iframe>
{/if}
