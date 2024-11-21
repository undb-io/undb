<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import { derived, type Readable, type Writable } from "svelte/store"
  import type { CalendarView, RecordDO } from "@undb/table"
  import { FieldIdVo, Records, type DateField, type DateRangeField } from "@undb/table"
  import { createRecordsStore, setRecordsStore } from "$lib/store/records.store"
  import CalendarViewToolbar from "./calendar-view-toolbar.svelte"
  import { calendarStore } from "$lib/store/calendar.store"

  const table = getTable()
  export let viewId: Readable<string | undefined>
  export let shareId: string | undefined = undefined
  export let readonly = false
  export let records: RecordDO[] | undefined = undefined
  export let disableRecordQuery = false
  export let r: Writable<string | null>

  $: view = $table.views.getViewById($viewId) as CalendarView
  $: fieldId = view.type === "calendar" ? view.field.into(undefined) : undefined
  $: field = fieldId
    ? ($table.schema.getFieldById(new FieldIdVo(fieldId)).into(undefined) as DateField | DateRangeField | undefined)
    : undefined

  const recordsStore = createRecordsStore()
  setRecordsStore(recordsStore)
  if (records) {
    recordsStore.setRecords(new Records(records), Date.now())
  }

  $: timeScale = view.timeScale
  let startOfWeekTimestamp = calendarStore.startOfWeekTimestamp
  let selectedDate = derived(calendarStore, ($calendarStore) => $calendarStore.selectedDate)
</script>

{#key $table.id.value}
  <CalendarViewToolbar {viewId} bind:view {readonly} {shareId} />
  {#if view.type === "calendar"}
    {#if field}
      {#if timeScale === "month"}
        {#await import("$lib/components/blocks/calendar-view/calendar-view-month.svelte") then { default: CalendarViewMonth }}
          <CalendarViewMonth {field} bind:view {shareId} {viewId} {disableRecordQuery} {readonly} {r} />
        {/await}
      {:else if timeScale === "week"}
        {#await import("$lib/components/blocks/calendar-view/calendar-view-day.svelte") then { default: CalendarViewWeek }}
          <CalendarViewWeek
            {field}
            bind:view
            {shareId}
            {viewId}
            {disableRecordQuery}
            {readonly}
            {r}
            startDate={startOfWeekTimestamp}
            days={7}
          />
        {/await}
      {:else if timeScale === "day"}
        {#await import("$lib/components/blocks/calendar-view/calendar-view-day.svelte") then { default: CalendarViewDay }}
          <CalendarViewDay
            {field}
            bind:view
            {shareId}
            {viewId}
            {disableRecordQuery}
            {readonly}
            {r}
            startDate={selectedDate}
            days={1}
          />
        {/await}
      {/if}
    {:else}
      <section class="flex h-full w-full items-center justify-center">
        {#await import("$lib/components/blocks/calendar-view/select-calendar-field.svelte") then { default: SelectCalendarField }}
          <SelectCalendarField bind:view />
        {/await}
      </section>
    {/if}
  {/if}
{/key}
