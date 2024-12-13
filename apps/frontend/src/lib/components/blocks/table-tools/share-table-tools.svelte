<script lang="ts">
  import ViewFilterEditor from "../view-filter-editor/view-filter-editor.svelte"
  import ViewColorEditor from "../view-color-editor/view-color-editor.svelte"
  import ViewSort from "../view-sort/view-sort.svelte"
  import ViewFields from "../view-fields/view-fields.svelte"
  import RecordsSearch from "../search/records-search.svelte"
  import ViewWidgetButton from "../view-widget/view-widget-button.svelte"
  import type { Readable } from "svelte/store"

  export let viewId: Readable<string | undefined>
</script>

<div class="flex items-center justify-between gap-2 border-b px-4 py-2">
  <div class="flex items-center gap-2">
    <ViewFilterEditor readonly {viewId} />
    <ViewColorEditor readonly />
    <ViewSort readonly {viewId} />
    <ViewFields readonly {viewId} />
    <slot></slot>
  </div>

  <div class="flex items-center gap-2">
    <RecordsSearch />
    <ViewWidgetButton readonly />
  </div>
</div>
