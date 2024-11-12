<script lang="ts">
  import { type Readable } from "svelte/store"
  import ShareGridView from "./share-grid-view.svelte"
  import { getTable } from "$lib/store/table.store"
  import ShareKanbanView from "./share-kanban-view.svelte"
  import ShareGalleryView from "./share-gallery-view.svelte"
  import ShareListView from "./share-list-view.svelte"
  import ShareCalendarView from "./share-calendar-view.svelte"
  import SharePivotView from "./share-pivot-view.svelte"

  const table = getTable()
  export let viewId: Readable<string>
  export let shareId: string

  $: view = $table.views.getViewById($viewId)
</script>

{#if view.type === "grid"}
  <ShareGridView {viewId} {shareId} />
{:else if view.type === "kanban"}
  <ShareKanbanView {viewId} {shareId} />
{:else if view.type === "gallery"}
  <ShareGalleryView {viewId} {shareId} />
{:else if view.type === "list"}
  <ShareListView {viewId} {shareId} />
{:else if view.type === "calendar"}
  <ShareCalendarView {viewId} {shareId} />
{:else if view.type === "pivot"}
  <SharePivotView {viewId} {shareId} />
{/if}
