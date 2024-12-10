<script lang="ts">
  import { TableFactory, TableDo } from "@undb/table"
  import type { PageData } from "./$types"
  import { setTable } from "$lib/store/table.store"
  import { writable, derived, type Writable } from "svelte/store"
  import { r } from "$lib/store/records.store"
  import View from "$lib/components/blocks/view/view.svelte"
  import { page } from "$app/stores"

  export let data: PageData

  $: table = data.table
  $: tableDo = table ? new TableFactory().fromJSON(table) : undefined
  let tableStore: Writable<TableDo | null> = writable(null)
  $: if (tableDo) {
    tableStore.set(tableDo)
    setTable(tableStore as Writable<TableDo>)
  }

  const viewId = derived(
    [page, tableStore],
    ([$page, $table]) => $page.params.viewId ?? $table?.views.getDefaultView().id.value,
  )
</script>

<main class="flex flex-1 flex-col overflow-hidden">
  <View {viewId} {r} shareId={undefined} readonly={false} />
</main>

{#await import("$lib/components/blocks/view/delete-view-dialog.svelte") then { default: DeleteViewDialog }}
  <DeleteViewDialog {viewId} />
{/await}
