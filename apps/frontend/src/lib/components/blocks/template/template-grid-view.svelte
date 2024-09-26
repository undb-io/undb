<script lang="ts">
  import GridViewDataTable from "$lib/components/blocks/grid-view/grid-view-data-table.svelte"
  import { createRecordsStore, setRecordsStore } from "$lib/store/records.store"
  import { writable } from "svelte/store"
  import { RecordDO, Records } from "@undb/table"
  import { type Readable } from "svelte/store"
  import { onDestroy } from "svelte"

  export let viewId: Readable<string | undefined>
  export let records: RecordDO[]

  const perPage = writable(50)
  const currentPage = writable(1)

  let store = createRecordsStore()
  setRecordsStore(store)

  store.setRecords(new Records(records), new Date().getTime())
  onDestroy(() => {
    store.clearRecords()
  })
</script>

{#if store}
  <GridViewDataTable {viewId} readonly {perPage} {currentPage} isLoading={false} total={records.length} />
{/if}
