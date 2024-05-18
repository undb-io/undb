<script lang="ts">
  import CreateRecordButton from "../create-record/create-record-button.svelte"
  import ViewFilterEditor from "../view-filter-editor/view-filter-editor.svelte"
  import ViewColorEditor from "../view-color-editor/view-color-editor.svelte"
  import ViewSort from "../view-sort/view-sort.svelte"
</script>

<div class="flex items-center gap-2 px-4 py-2">
  <CreateRecordButton />
  <ViewFilterEditor />
  <ViewColorEditor />
  <ViewSort />
</div>
