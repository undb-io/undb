<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import { getRecordsStore } from "$lib/store/records.store"
  import { DateIsSameDay, type RecordDO, type DateField, type DateRangeField, DateFieldValue } from "@undb/table"
  import { type Writable } from "svelte/store"
  import { onMount } from "svelte"
  import { calendarStore } from "$lib/store/calendar.store"
  import CalendarViewMonthDateRecord from "./calendar-view-month-date-record.svelte"
  import { getDate } from "date-fns/getDate"
  import { isToday } from "date-fns/isToday"
  import { isWeekend } from "date-fns/isWeekend"
  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
  import { format } from "date-fns/format"
  import { cn } from "$lib/utils"
  import { CREATE_RECORD_MODAL, openModal } from "$lib/store/modal.store"
  import { defaultRecordValues } from "$lib/store/records.store"
  import { type Readable } from "svelte/store"
  import { getDataService } from "$lib/store/data-service.store"

  export let field: DateField | DateRangeField
  export let date: Date
  export let r: Writable<string | null>
  export let readonly = false
  export let shareId: string | undefined = undefined
  export let viewId: Readable<string | undefined>

  const table = getTable()
  const store = getRecordsStore()

  const records = store.records

  const isSelected = calendarStore.isSelected
  const getIsSameMonth = calendarStore.getIsSameMonth

  const dataService = getDataService()

  $: color = $viewId ? $table.views.getViewById($viewId)?.color.into(undefined) : undefined

  $: day = getDate(date)
  $: today = isToday(date)
  $: _isWeekend = isWeekend(date)

  $: selected = $isSelected(date)
  $: isSameMonth = $getIsSameMonth(date)

  $: dateRecords = $records.filter((r) => {
    const spec = new DateIsSameDay(date, field.id)
    return spec.isSatisfiedBy(r)
  })

  $: displayField = $table.schema.getDefaultDisplayField().into(undefined)

  let containerEl: HTMLElement
  let visibleRecords: RecordDO[] = []
  let remainingCount = 0

  function updateVisibleItems() {
    if (!containerEl) return

    const itemHeight = 24 // 每个项目的预计高度(px)，包括间距
    const containerHeight = containerEl.clientHeight
    const maxItems = Math.floor(containerHeight / itemHeight)

    visibleRecords = dateRecords.slice(0, maxItems)
    remainingCount = Math.max(0, dateRecords.length - maxItems)
  }

  onMount(() => {
    const resizeObserver = new ResizeObserver(() => {
      updateVisibleItems()
    })

    if (containerEl) {
      resizeObserver.observe(containerEl)
    }

    return () => resizeObserver.disconnect()
  })

  $: {
    // 当记录变化时重新计算
    if (dateRecords) {
      updateVisibleItems()
    }
  }

  const updateRecord = createMutation({
    mutationFn: dataService.records.updateRecord,
  })

  const client = useQueryClient()

  let aboutToDropRecord: RecordDO | undefined = undefined

  function setupDropTarget(node: HTMLElement, date: Date) {
    if (readonly || shareId) return
    function setup(date: Date) {
      dropTargetForElements({
        element: node,
        getData(e) {
          return {
            type: "calendar-date-drop",
            date,
          }
        },
        onDragEnter(args) {
          const record = args.source.data.record as RecordDO
          aboutToDropRecord = record
        },
        onDragLeave(args) {
          aboutToDropRecord = undefined
        },
        async onDrop(args) {
          aboutToDropRecord = undefined
          const data = args.source.data
          const type = data.type
          if (type !== "calendar-date-drag") {
            return
          }

          const date = args.self.data.date as Date

          const record = data.record as RecordDO

          const d = format(date, "yyyy-MM-dd")

          record.values.setValue(field.id, new DateFieldValue(d))
          store.setRecord(record)

          await $updateRecord.mutateAsync({
            tableId: $table.id.value,
            id: record.id.value,
            values: {
              [field.id.value]: d,
            },
          })
          await client.invalidateQueries({
            queryKey: ["records", $table.id.value, $viewId],
          })
        },
      })
    }

    setup(date)

    return {
      update: setup,
    }
  }

  function onCreateRecord(date: Date) {
    if (readonly || shareId) return
    defaultRecordValues.set({
      [field.id.value]: format(date, "yyyy-MM-dd"),
    })
    openModal(CREATE_RECORD_MODAL)
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  use:setupDropTarget={date}
  on:click={() => calendarStore.select(date)}
  on:dblclick={() => onCreateRecord(date)}
  class={cn(
    "group relative h-full border-b border-r border-gray-200 bg-white p-2",
    ($calendarStore.dates.indexOf(date) + 1) % 7 === 0 && "border-r-0",
    _isWeekend && "bg-gray-50",
  )}
>
  <div
    class={cn(
      "absolute inset-0 flex h-full w-full flex-col overflow-hidden border-2 border-transparent px-1.5 py-1",
      selected && "border-blue-500",
    )}
  >
    <button
      on:click={(e) => {
        e.stopPropagation()

        onCreateRecord(date)
      }}
      class={cn(
        "absolute left-1 top-1 flex size-5 items-center justify-center rounded-sm border bg-white text-lg font-light text-gray-500 opacity-0 transition hover:bg-gray-100 group-hover:opacity-100",
        selected && "opacity-100",
        readonly && "pointer-events-none hidden",
      )}>+</button
    >
    <div class="mb-1 flex justify-end">
      <div
        class={cn(
          "flex size-5 items-center justify-center text-right text-sm",
          today && "rounded-full bg-blue-500 text-white",
          !isSameMonth && "text-gray-400",
        )}
      >
        {day}
      </div>
    </div>
    <div class="h-full flex-1 space-y-0.5 overflow-hidden" bind:this={containerEl}>
      {#if aboutToDropRecord && !shareId && !readonly}
        <CalendarViewMonthDateRecord
          {date}
          {r}
          readonly={true}
          {shareId}
          record={aboutToDropRecord}
          {displayField}
          {field}
          {color}
          class="opacity-50"
        />
      {/if}
      {#each visibleRecords as record (record.id.value)}
        <CalendarViewMonthDateRecord {color} {date} {r} {record} {displayField} {field} {shareId} {readonly} />
      {/each}
    </div>
    {#if remainingCount > 0}
      <button
        on:click={() => {
          calendarStore.select(date)
          calendarStore.setScope("selectedDate")
        }}
        class="absolute bottom-0 right-0 rounded-sm border bg-white px-1 py-0.5 text-[10px] text-gray-500 transition-all hover:bg-gray-50 hover:shadow-sm"
      >
        +{remainingCount}
      </button>
    {/if}
  </div>
</div>
