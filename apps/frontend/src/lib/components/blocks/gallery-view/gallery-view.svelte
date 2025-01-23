<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import { derived, writable, type Readable, type Writable } from "svelte/store"
  import { type GalleryView, type IRecordsDTO, RecordDO, Records } from "@undb/table"
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
  import GalleryViewOptionButton from "./gallery-option-button.svelte"
  import { getDataService } from "$lib/store/data-service.store"

  const table = getTable()
  export let viewId: Readable<string | undefined>
  export let shareId: string | undefined = undefined
  export let r: Writable<string | null>
  export let disableRecordQuery = false
  export let records: RecordDO[] | undefined = undefined
  export let readonly = false

  $: view = $table.views.getViewById($viewId) as GalleryView

  $: field = view.gallery.unwrapOrElse(() => ({ field: undefined })).field

  const perPage = writable(50)
  const currentPage = writable(1)
  const q = queryParam("q")

  const dataService = getDataService()

  const getRecords = async () => {
    if (shareId) {
      return trpc.shareData.records.query({
        shareId,
        tableId: $table?.id.value,
        viewId: $viewId,
        q: $q ?? undefined,
        pagination: { limit: $perPage, page: $currentPage },
      })
    }
    return dataService.records.getRecords({
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
        enabled: view?.type === "gallery" && !disableRecordQuery,
        queryFn: getRecords,
      }
    }),
  )

  let isLoading = derived([getRecordsQuery], ([$getRecords]) => $getRecords.isLoading)

  const recordsStore = createRecordsStore()
  setRecordsStore(recordsStore)

  let rs = derived([getRecordsQuery], ([$getRecords]) => {
    return (($getRecords.data as any)?.records as IRecordsDTO) ?? []
  })
  $: if (!disableRecordQuery) {
    recordsStore.setRecords(Records.fromJSON($table, $rs), $getRecordsQuery.dataUpdatedAt)
  } else {
    recordsStore.setRecords(new Records(records ?? []), Date.now())
  }

  $: total = ($getRecordsQuery.data as any)?.total
</script>

<TableTools {r} {viewId} {readonly} {shareId}>
  {#if !shareId}
    <GalleryViewOptionButton {view} {readonly} />
  {/if}
</TableTools>
<div class={cn("flex-1 overflow-y-auto overflow-x-hidden p-4")}>
  {#if $isLoading}
    <GalleryViewLoading {viewId} />
  {:else}
    <GalleryViewCards fieldId={field} {viewId} {r} />
  {/if}
</div>
{#if field}
  <ViewPagination perPage={$perPage} bind:currentPage={$currentPage} count={total} />
{/if}
