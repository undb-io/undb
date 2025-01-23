<script lang="ts">
  import CreateRecordButton from "../create-record/create-record-button.svelte"
  import ViewFilterEditor from "../view-filter-editor/view-filter-editor.svelte"
  import ViewColorEditor from "../view-color-editor/view-color-editor.svelte"
  import ViewSort from "../view-sort/view-sort.svelte"
  import RecordsSearch from "../search/records-search.svelte"
  import ViewFields from "../view-fields/view-fields.svelte"
  import ShareViewButton from "../share/share-view-button.svelte"
  import BulkUpdateRecordsButton from "../bulk-update-records/bulk-update-records-button.svelte"
  import ViewWidgetButton from "../view-widget/view-widget-button.svelte"
  import type { Readable, Writable } from "svelte/store"
  import { getIsPlayground } from "$lib/store/playground.svelte"

  export let readonly = false
  export let r: Writable<string | null>
  export let viewId: Readable<string | undefined>
  export let shareId: string | undefined

  const isPlayground = getIsPlayground()
</script>

<div class="flex items-center justify-between gap-2 border-b px-4 py-2">
  <div class="flex items-center gap-2">
    {#if !readonly}
      <CreateRecordButton />
    {/if}
    <ViewFilterEditor {readonly} {viewId} {shareId} />
    <ViewColorEditor {readonly} {viewId} />
    <ViewSort {readonly} {viewId} />
    <ViewFields {readonly} {viewId} />
    <slot></slot>
  </div>

  <div class="flex items-center gap-2">
    {#if !readonly}
      <BulkUpdateRecordsButton {r} {viewId} />
      {#if !isPlayground}
        <ShareViewButton />
      {/if}
    {/if}
    <RecordsSearch />
    <ViewWidgetButton {readonly} />
  </div>
</div>
