<script lang="ts">
  import { getTable } from "$lib/store/table.store"
    import type { Readable } from "svelte/store"
  import GridView from "../grid-view/grid-view.svelte"
  import KanbanView from "../kanban-view/kanban-view.svelte"

  const table = getTable()
  export let viewId: Readable<string>

  $: view = $table.views.getViewById($viewId)
</script>

{#if view}
  {#if view.type === "kanban"}
    <KanbanView {viewId} />
  {:else if view.type === "grid"}
    <GridView {viewId} />
  {/if}
{/if}
