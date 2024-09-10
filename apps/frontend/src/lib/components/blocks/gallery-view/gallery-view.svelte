<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import { derived, writable, type Readable } from "svelte/store"
  import { type GalleryView, type IRecordsDTO, Records } from "@undb/table"
  import { queryParam } from "sveltekit-search-params"
  import TableTools from "../table-tools/table-tools.svelte"
  import { trpc } from "$lib/trpc/client"
  import { createQuery } from "@tanstack/svelte-query"
  import GalleryViewCards from "./gallery-view-cards.svelte"
  import { createRecordsStore, setRecordsStore } from "$lib/store/records.store"
  import GalleryViewField from "./gallery-view-field.svelte"
  import ViewPagination from "../view/view-pagination.svelte"

  const table = getTable()
  export let viewId: Readable<string>
  export let shareId: string | undefined = undefined

  let view = $table.views.getViewById($viewId) as GalleryView

  $: field = view.gallery.unwrapOrElse(() => ({ field: undefined })).field

  const perPage = writable(50)
  const currentPage = writable(1)
  const q = queryParam("q")

  const getRecords = createQuery(
    derived([table, viewId, perPage, currentPage, q], ([$table, $viewId, $perPage, $currentPage, $q]) => {
      const view = $table.views.getViewById($viewId)
      return {
        queryKey: ["records", $table?.id.value, $viewId, $q, $currentPage, $perPage],
        enabled: view?.type === "gallery",
        queryFn: () =>
          trpc.record.list.query({
            tableId: $table?.id.value,
            viewId: $viewId,
            q: $q ?? undefined,
            pagination: { limit: $perPage, page: $currentPage },
          }),
      }
    }),
  )

  const recordsStore = createRecordsStore()
  setRecordsStore(recordsStore)

  // $: records = (($getRecords.data as any)?.records as IRecordsDTO) ?? []
  let records = derived([getRecords], ([$getRecords]) => {
    return (($getRecords.data as any)?.records as IRecordsDTO) ?? []
  })
  $: recordsStore.setRecords(Records.fromJSON($table, $records), $getRecords.dataUpdatedAt)

  $: total = ($getRecords.data as any)?.total
</script>

<TableTools />
<div class="flex-1 overflow-x-auto overflow-y-hidden p-4">
  {#if !field}
    <GalleryViewField {view} />
  {:else}
    <GalleryViewCards fieldId={field} {viewId} />
  {/if}
</div>
<ViewPagination perPage={$perPage} bind:currentPage={$currentPage} count={total} />

{#await import("$lib/components/blocks/create-record/create-record-sheet.svelte") then { default: CreateRecordSheet }}
  <CreateRecordSheet />
{/await}

{#await import("$lib/components/blocks/record-detail/table-record-detail-sheet.svelte") then { default: TableRecordDetailSheet }}
  <TableRecordDetailSheet />
{/await}
