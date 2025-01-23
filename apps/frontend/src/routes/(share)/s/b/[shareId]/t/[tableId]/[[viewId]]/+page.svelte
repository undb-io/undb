<script lang="ts">
  import { page } from "$app/stores"
  import { getTable } from "$lib/store/table.store"
  import { onMount, type ComponentType } from "svelte"
  import { derived } from "svelte/store"
  import { isDataTab, isFormTab } from "$lib/store/tab.store"
  import ShareTableHeader from "$lib/components/blocks/table-header/share-table-header.svelte"
  import FormsReadonly from "$lib/components/blocks/forms/forms-readonly.svelte"
  import ShareGridView from "$lib/components/blocks/share/share-grid-view.svelte"
  import ShareGalleryView from "$lib/components/blocks/share/share-gallery-view.svelte"
  import ShareKanbanView from "$lib/components/blocks/share/share-kanban-view.svelte"
  import { r } from "$lib/store/records.store"
  import { setShareId } from "$lib/store/share.store.svelte"

  let RecordDetailSheet: ComponentType

  let viewId = derived(page, (page) => page.params.viewId)
  let shareId = derived(page, (page) => page.params.shareId)
  onMount(async () => {
    RecordDetailSheet = (await import("$lib/components/blocks/record-detail/share-record-detail-sheet.svelte")).default
  })

  $: if ($shareId) {
    setShareId($shareId)
  }

  const t = getTable()

  $: view = $t.views.getViewById($viewId)
</script>

<ShareTableHeader />
<main class="flex h-full flex-1 flex-col overflow-auto">
  {#if $isDataTab}
    {#if view?.type === "grid"}
      <ShareGridView {viewId} shareId={$shareId} />
    {:else if view.type === "kanban"}
      <ShareKanbanView {viewId} shareId={$shareId} />
    {:else if view.type === "gallery"}
      <ShareGalleryView {viewId} shareId={$shareId} />
    {/if}
  {:else if $isFormTab}
    <FormsReadonly />
  {/if}
</main>

{#if RecordDetailSheet}
  <RecordDetailSheet {viewId} readonly {r} />
{/if}
