<script lang="ts">
  import CreateRecordButton from "../create-record/create-record-button.svelte"
  import ViewFilterEditor from "../view-filter-editor/view-filter-editor.svelte"
  import ViewColorEditor from "../view-color-editor/view-color-editor.svelte"
  import ViewSort from "../view-sort/view-sort.svelte"
  import RecordsSearch from "../search/records-search.svelte"
  import CreateFieldButton from "../create-field/create-field-button.svelte"
  import ViewFields from "../view-fields/view-fields.svelte"
  import ShareViewButton from "../share/share-view-button.svelte"
  import BulkUpdateRecordsButton from "../bulk-update-records/bulk-update-records-button.svelte"
  import ViewWidgetButton from "../view-widget/view-widget-button.svelte"
  import type { Writable } from "svelte/store"

  export let readonly = false
  export let r: Writable<string | null>
</script>

<div class="flex items-center justify-between gap-2 border-b px-4 py-2">
  <div class="flex items-center gap-2">
    {#if !readonly}
      <CreateRecordButton />
    {/if}
    <ViewFilterEditor {readonly} />
    <ViewColorEditor {readonly} />
    <ViewSort {readonly} />
    <ViewFields {readonly} />
    <slot></slot>
  </div>

  <div class="flex items-center gap-2">
    {#if !readonly}
      <BulkUpdateRecordsButton {r} />
      <ShareViewButton />
    {/if}
    <RecordsSearch />
    <ViewWidgetButton />
  </div>
</div>
