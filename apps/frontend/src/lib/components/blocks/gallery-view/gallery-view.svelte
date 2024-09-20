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
  import { cn } from "$lib/utils"
  import GalleryViewLoading from "./gallery-view-loading.svelte"

  const table = getTable()
  export let viewId: Readable<string>
  export let shareId: string | undefined = undefined

  $: view = $table.views.getViewById($viewId) as GalleryView

  $: field = view.gallery.unwrapOrElse(() => ({ field: undefined })).field

  const perPage = writable(50)
  const currentPage = writable(1)
  const q = queryParam("q")

  const getRecords = () => {
    if (shareId) {
      return trpc.shareData.records.query({
        shareId,
        tableId: $table?.id.value,
        viewId: $viewId,
        q: $q ?? undefined,
        pagination: { limit: $perPage, page: $currentPage },
      })
    }
    return trpc.record.list.query({
      tableId: $table?.id.value,
      viewId: $viewId,
      q: $q ?? undefined,
      pagination: { limit: $perPage, page: $currentPage },
    })
  }

  const getRecordsQuery = createQuery(
    derived([table, viewId, perPage, currentPage, q], ([$table, $viewId, $perPage, $currentPage, $q]) => {
      const view = $table.views.getViewById($viewId)
      return {
        queryKey: ["records", $table?.id.value, $viewId, $q, $currentPage, $perPage],
        enabled: view?.type === "gallery",
        queryFn: getRecords,
      }
    }),
  )

  let isLoading = derived([getRecordsQuery], ([$getRecords]) => $getRecords.isLoading)

  const recordsStore = createRecordsStore()
  setRecordsStore(recordsStore)

  // $: records = (($getRecords.data as any)?.records as IRecordsDTO) ?? []
  let records = derived([getRecordsQuery], ([$getRecords]) => {
    return (($getRecords.data as any)?.records as IRecordsDTO) ?? []
  })
  $: recordsStore.setRecords(Records.fromJSON($table, $records), $getRecordsQuery.dataUpdatedAt)

  $: total = ($getRecordsQuery.data as any)?.total
</script>

<TableTools />
<div class={cn("flex-1 overflow-y-auto overflow-x-hidden p-4", !field && "bg-muted")}>
  {#if !field}
    <GalleryViewField {view} />
  {:else if $isLoading}
    <GalleryViewLoading />
  {:else}
    <GalleryViewCards fieldId={field} {viewId} />
  {/if}
</div>
{#if field}
  <ViewPagination perPage={$perPage} bind:currentPage={$currentPage} count={total} />
{/if}

{#await import("$lib/components/blocks/create-record/create-record-sheet.svelte") then { default: CreateRecordSheet }}
  <CreateRecordSheet />
{/await}

{#await import("$lib/components/blocks/record-detail/table-record-detail-sheet.svelte") then { default: TableRecordDetailSheet }}
  <TableRecordDetailSheet />
{/await}
