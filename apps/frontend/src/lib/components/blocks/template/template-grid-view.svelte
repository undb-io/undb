<script lang="ts">
  import GridViewDataTable from "$lib/components/blocks/grid-view/grid-view-data-table.svelte"
  import { createRecordsStore, setRecordsStore } from "$lib/store/records.store"
  import { writable, type Writable } from "svelte/store"
  import { RecordDO, Records } from "@undb/table"
  import { type Readable } from "svelte/store"
  import { onDestroy, onMount } from "svelte"
  import { DataService } from "@undb/data-service"
  import { container } from "@undb/di"
  import { type IQueryBuilder, QUERY_BUILDER } from "@undb/persistence/client"

  export let tableId: string
  export let viewId: Readable<string | undefined>
  export let records: RecordDO[]
  export let r: Writable<string | null>

  const perPage = writable(50)
  const currentPage = writable(1)

  let store = createRecordsStore()
  setRecordsStore(store)

  // let dataService: DataService
  // onMount(async () => {
  //   dataService = container.resolve<DataService>(DataService)

  //   const qb = container.resolve<IQueryBuilder>(QUERY_BUILDER)
  //   const tables = await qb.selectFrom("undb_table").selectAll().execute()

  //   const records = await dataService.records.getRecords({
  //     tableId: tableId,
  //   })
  //   console.log(records)
  // })

  store.setRecords(new Records(records), new Date().getTime())
  onDestroy(() => {
    store.clearRecords()
  })
</script>

{#if store}
  {#key $viewId}
    <GridViewDataTable
      {viewId}
      {r}
      readonly
      {perPage}
      {currentPage}
      isLoading={false}
      total={records.length}
      hidePagination
    />
  {/key}
{/if}
