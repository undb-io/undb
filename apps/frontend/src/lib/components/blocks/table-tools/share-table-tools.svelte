<script lang="ts">
  import ViewFilterEditor from "../view-filter-editor/view-filter-editor.svelte"
  import ViewColorEditor from "../view-color-editor/view-color-editor.svelte"
  import ViewSort from "../view-sort/view-sort.svelte"
  import RecordsSearch from "../search/records-search.svelte"
</script>

<div class="flex items-center justify-between gap-2 border-b px-4 py-2">
  <div class="flex items-center gap-2">
    <ViewFilterEditor readonly />
    <ViewColorEditor readonly />
    <ViewSort readonly />
    <slot></slot>
  </div>

  <div class="flex items-center gap-2">
    <RecordsSearch />
  </div>
</div>
