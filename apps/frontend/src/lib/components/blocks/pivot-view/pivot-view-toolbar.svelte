<script lang="ts">
  import { type Readable } from "svelte/store"
  import ViewFilterEditor from "../view-filter-editor/view-filter-editor.svelte"
  import ViewSort from "../view-sort/view-sort.svelte"
  import CreateRecordButton from "../create-record/create-record-button.svelte"
  import PivotOptionButton from "./pivot-option-button.svelte"
  import type { PivotView } from "@undb/table"

  export let viewId: Readable<string>
  export let view: PivotView
</script>

<div class="flex justify-between gap-2 border-b px-2 py-2">
  <div class="flex items-center gap-2">
    <CreateRecordButton />
    <ViewFilterEditor {viewId} />
    <ViewSort {viewId} />
    <PivotOptionButton {view} />
  </div>
</div>
