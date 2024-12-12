<script lang="ts">
  import { type IRecordsDTO, Records, type CalendarView, type DateField, type DateRangeField } from "@undb/table"
  import { derived, type Readable } from "svelte/store"
  import type { Writable } from "svelte/store"
  import { calendarStore } from "$lib/store/calendar.store"
  import { createRecordsStore, setRecordsStore } from "$lib/store/records.store"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createQuery } from "@tanstack/svelte-query"
  import { queryParam } from "sveltekit-search-params"
  import CalendarDateRemoveButton from "./calendar-date-remove-button.svelte"
  import CalendarViewMonthRecords from "./calendar-view-month-records.svelte"
  import CalendarViewMonthDate from "./calendar-view-month-date.svelte"
  import { getDataService } from "$lib/store/data-service.store"

  export let viewId: Readable<string | undefined>
  export let view: CalendarView
  export let readonly = false
  export let shareId: string | undefined = undefined
  export let disableRecordQuery = false
  export let r: Writable<string | null>
  export let field: DateField | DateRangeField

  const startTimestamp = calendarStore.startTimestamp
  const endTimestamp = calendarStore.endTimestamp

  const t = getTable()
  const q = queryParam("q")
  const dataService = getDataService()

  const getRecords = createQuery(
    derived([t, viewId, q, startTimestamp, endTimestamp], ([$table, $viewId, $q, $startTimestamp, $endTimestamp]) => {
      const view = $table.views.getViewById($viewId)
      return {
        queryKey: [
          "records",
          $table?.id.value,
          $viewId,
          $q,
          $startTimestamp?.toISOString(),
          $endTimestamp?.toISOString(),
        ],
        enabled: view?.type === "calendar" && !!$startTimestamp && !!$endTimestamp && !disableRecordQuery,
        queryFn: async () => {
          if (shareId) {
            return trpc.shareData.records.query({
              shareId,
              tableId: $table?.id.value,
              viewId: $viewId,
              q: $q ?? undefined,
              filters: {
                conjunction: "and",
                children: [
                  { field: field.id.value, op: "is_after", value: $startTimestamp!.toISOString() },
                  { field: field.id.value, op: "is_before", value: $endTimestamp!.toISOString() },
                ],
              },
            })
          }
          return dataService.records.getRecords({
            tableId: $table?.id.value,
            viewId: $viewId,
          })
        },
      }
    }),
  )

  // TODO: record type
  $: records = (($getRecords.data as any)?.records as IRecordsDTO) ?? []

  const store = createRecordsStore()
  setRecordsStore(store)

  $: if ($getRecords.isSuccess) {
    store.setRecords(Records.fromJSON($t, records), $getRecords.dataUpdatedAt)
  }
</script>

<div class="prevent-select relative flex h-full flex-1 overflow-x-auto overflow-y-hidden">
  <div class="relative h-full flex-1">
    <div class="grid grid-cols-7 border-b">
      <div
        class="border-r-1 border-gray-200 bg-gray-50 py-1 text-center text-xs font-semibold uppercase leading-4 text-gray-500 last:border-r-0"
      >
        mon
      </div>
      <div
        class="border-r-1 border-gray-200 bg-gray-50 py-1 text-center text-xs font-semibold uppercase leading-4 text-gray-500 last:border-r-0"
      >
        tue
      </div>
      <div
        class="border-r-1 border-gray-200 bg-gray-50 py-1 text-center text-xs font-semibold uppercase leading-4 text-gray-500 last:border-r-0"
      >
        wed
      </div>
      <div
        class="border-r-1 border-gray-200 bg-gray-50 py-1 text-center text-xs font-semibold uppercase leading-4 text-gray-500 last:border-r-0"
      >
        thu
      </div>
      <div
        class="border-r-1 border-gray-200 bg-gray-50 py-1 text-center text-xs font-semibold uppercase leading-4 text-gray-500 last:border-r-0"
      >
        fri
      </div>
      <div
        class="border-r-1 border-gray-200 bg-gray-50 py-1 text-center text-xs font-semibold uppercase leading-4 text-gray-500 last:border-r-0"
      >
        sat
      </div>
      <div
        class="border-r-1 border-gray-200 bg-gray-50 py-1 text-center text-xs font-semibold uppercase leading-4 text-gray-500 last:border-r-0"
      >
        sun
      </div>
    </div>
    <div class="grid h-full grid-cols-7 grid-rows-5">
      {#each $calendarStore.dates as date}
        <CalendarViewMonthDate {date} {r} {field} {readonly} {shareId} {viewId} />
      {/each}
    </div>
    <div class="absolute bottom-4 right-2">
      <!-- TODO: is dragging -->
      {#if !readonly}
        <CalendarDateRemoveButton bind:view />
      {/if}
    </div>
  </div>
  <div class="flex h-full w-[300px] flex-col divide-y border-l">
    <CalendarViewMonthRecords bind:view {r} {viewId} {field} {shareId} {readonly} />
  </div>
</div>
