<script lang="ts">
  import { type Readable } from "svelte/store"
  import ShareGridView from "./share-grid-view.svelte"
  import { getTable } from "$lib/store/table.store"
  import ShareKanbanView from "./share-kanban-view.svelte"
  import ShareGalleryView from "./share-gallery-view.svelte"

  const table = getTable()
  export let viewId: Readable<string>
  export let shareId: string

  $: view = $table.views.getViewById($viewId)
</script>

{#if view.type === "grid"}
  <ShareGridView {viewId} />
{:else if view.type === "kanban"}
  <ShareKanbanView {viewId} {shareId} />
{:else if view.type === "gallery"}
  <ShareGalleryView {viewId} {shareId} />
{/if}
