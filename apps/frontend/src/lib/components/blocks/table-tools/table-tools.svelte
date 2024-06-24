<script lang="ts">
  import CreateRecordButton from "../create-record/create-record-button.svelte"
  import ViewFilterEditor from "../view-filter-editor/view-filter-editor.svelte"
  import ViewColorEditor from "../view-color-editor/view-color-editor.svelte"
  import ViewSort from "../view-sort/view-sort.svelte"
  import RecordsSearch from "../search/records-search.svelte"
  import CreateFieldButton from "../create-field/create-field-button.svelte"
  import ViewFields from "../view-fields/view-fields.svelte"
  import ShareViewButton from "../share/share-view-button.svelte"
</script>

<div class="flex items-center justify-between gap-2 border-b px-4 py-2">
  <div class="flex items-center gap-2">
    <CreateRecordButton />
    <ViewFilterEditor />
    <ViewColorEditor />
    <ViewSort />
    <ViewFields />
  </div>

  <div class="flex items-center gap-2">
    <CreateFieldButton />
    <ShareViewButton />
    <RecordsSearch />
  </div>
</div>
