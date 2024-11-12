<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import type { Readable, Writable } from "svelte/store"
  import type { CalendarView, RecordDO } from "@undb/table"
  import { FieldIdVo, Records, type DateField, type DateRangeField } from "@undb/table"
  import { createRecordsStore, setRecordsStore } from "$lib/store/records.store"
  import CalendarViewToolbar from "./calendar-view-toolbar.svelte"

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
</script>

{#key $table.id.value}
  <CalendarViewToolbar {viewId} {view} {readonly} />
  {#if view.type === "calendar"}
    {#if field}
      {#await import("$lib/components/blocks/calendar-view/calendar-view-month.svelte") then { default: CalendarViewMonth }}
        <CalendarViewMonth {field} {view} {shareId} {viewId} {disableRecordQuery} {readonly} {r} />
      {/await}
    {:else}
      <section class="flex h-full w-full items-center justify-center">
        {#await import("$lib/components/blocks/calendar-view/select-calendar-field.svelte") then { default: SelectCalendarField }}
          <SelectCalendarField {view} />
        {/await}
      </section>
    {/if}
  {/if}
{/key}
