<script s lang="ts">
  import { getTable } from "$lib/store/table.store"
  import type { Readable, Writable } from "svelte/store"
  import GridView from "../grid-view/grid-view.svelte"
  import KanbanView from "../kanban-view/kanban-view.svelte"
  import GalleryView from "../gallery-view/gallery-view.svelte"
  import ListView from "../list-view/list-view.svelte"
  import CalendarView from "../calendar-view/calendar-view.svelte"
  import PivotView from "../pivot-view/pivot-view.svelte"

  export let r: Writable<string | null>
  export const table = getTable()
  export let viewId: Readable<string | undefined>
  export let shareId: string | undefined
  export let readonly = false

  $: view = $table.views.getViewById($viewId)
</script>

{#key $viewId}
  {#if view}
    {#if view.type === "kanban"}
      <KanbanView {viewId} {r} {readonly} />
    {:else if view.type === "grid"}
      <GridView {viewId} {r} {readonly} />
    {:else if view.type === "gallery"}
      <GalleryView {viewId} {r} {readonly} />
    {:else if view.type === "list"}
      <ListView {viewId} {r} {readonly} />
    {:else if view.type === "calendar"}
      <CalendarView {viewId} {r} {readonly} />
    {:else if view.type === "pivot"}
      <PivotView {viewId} {r} {shareId} {readonly} />
    {/if}
  {/if}

  {#await import("$lib/components/blocks/create-record/create-record-sheet.svelte") then { default: CreateRecordSheet }}
    <CreateRecordSheet />
  {/await}

  {#await import("$lib/components/blocks/record-detail/table-record-detail-sheet.svelte") then { default: TableRecordDetailSheet }}
    <TableRecordDetailSheet {viewId} />
  {/await}

  {#await import("$lib/components/blocks/view-widget/view-widget-sheet.svelte") then { default: ViewWidgetSheet }}
    <ViewWidgetSheet {viewId} {shareId} {readonly} />
  {/await}
{/key}
