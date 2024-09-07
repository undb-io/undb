<script lang="ts">
  import type { Readable } from "svelte/store"
  import KanbanView from "../kanban-view/kanban-view.svelte"

  export let viewId: Readable<string>
  export let shareId: string
</script>

<KanbanView {shareId} {viewId} />
