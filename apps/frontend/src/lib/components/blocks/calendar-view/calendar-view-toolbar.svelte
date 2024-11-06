<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import CalendarViewMiniMonthControl from "./calendar-view-mini-month-control.svelte"
  import { monthStore } from "$lib/store/calendar.store"
  import ViewFilterEditor from "../view-filter-editor/view-filter-editor.svelte"
  import ViewFields from "../view-fields/view-fields.svelte"
  import { type Readable } from "svelte/store"
  import CalendarOptionButton from "./calendar-option-button.svelte"
  import { CalendarView } from "@undb/table"
  import ViewSort from "../view-sort/view-sort.svelte"
  import CreateRecordButton from "../create-record/create-record-button.svelte"
  import ShareButton from "../share/share-button.svelte"
  import ViewWidgetButton from "../view-widget/view-widget-button.svelte"

  export let viewId: Readable<string | undefined>
  export let view: CalendarView
  export let readonly = false
</script>

<div class="flex justify-between gap-2 border-b px-2 py-2">
  <div class="flex items-center gap-2">
    <CreateRecordButton size="xs" />
    <CalendarViewMiniMonthControl />
    <Button variant="outline" size="xs" on:click={() => monthStore.reset()}>Today</Button>
  </div>

  <div>
    <CalendarOptionButton {readonly} {view} size="xs" />
    <ViewFilterEditor {readonly} {viewId} size="xs" />
    <ViewFields {readonly} {viewId} size="xs" />
    <ViewSort {readonly} {viewId} size="xs" />
    {#if $viewId}
      <ShareButton type="view" id={$viewId} size="xs" />
    {/if}

    <ViewWidgetButton size="xs" />
  </div>
</div>
