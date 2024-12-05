<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import CalendarViewMiniMonthControl from "./calendar-view-mini-month-control.svelte"
  import { calendarStore } from "$lib/store/calendar.store"
  import ViewFilterEditor from "../view-filter-editor/view-filter-editor.svelte"
  import ViewFields from "../view-fields/view-fields.svelte"
  import { type Readable } from "svelte/store"
  import CalendarOptionButton from "./calendar-option-button.svelte"
  import { CalendarView } from "@undb/table"
  import ViewSort from "../view-sort/view-sort.svelte"
  import CreateRecordButton from "../create-record/create-record-button.svelte"
  import ShareButton from "../share/share-button.svelte"
  import ViewWidgetButton from "../view-widget/view-widget-button.svelte"
  import ViewColorEditor from "../view-color-editor/view-color-editor.svelte"
  import CalendarTimescalePicker from "./calendar-timescale-picker.svelte"
  import { LL } from "@undb/i18n/client"

  export let viewId: Readable<string | undefined>
  export let view: CalendarView
  export let readonly = false
  export let shareId: string | undefined
</script>

<div class="flex justify-between gap-2 border-b px-2 py-2">
  <div class="flex items-center gap-2">
    <CreateRecordButton size="xs" />
    <CalendarViewMiniMonthControl bind:view />
    <Button variant="outline" size="xs" on:click={() => calendarStore.reset()}>{$LL.common.today()}</Button>
    {#if !shareId}
      <CalendarTimescalePicker size="xs" bind:view />
    {/if}
  </div>

  <div>
    <CalendarOptionButton {readonly} bind:view size="xs" />
    <ViewFilterEditor {readonly} {viewId} size="xs" />
    <ViewFields {readonly} {viewId} size="xs" />
    <ViewSort {readonly} {viewId} size="xs" />
    <ViewColorEditor {readonly} {viewId} size="xs" />
    {#if $viewId}
      <ShareButton type="view" id={$viewId} size="xs" />
    {/if}

    <ViewWidgetButton size="xs" {readonly} />
  </div>
</div>
