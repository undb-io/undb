<script lang="ts">
  import { type CalendarView, type DateField, type DateRangeField } from "@undb/table"
  import { derived, get, readable, type Readable } from "svelte/store"
  import type { Writable } from "svelte/store"
  import CalendarViewMonthRecords from "./calendar-view-month-records.svelte"
  import { cn } from "$lib/utils"
  import { format } from "date-fns"
  import CalendarViewMiniDay from "./calendar-view-mini-day.svelte"
  import { addDays } from "date-fns"
  import CalendarViewDayTimeline from "./calendar-view-day-timeline.svelte"
  import { HOURS, formatHour } from "$lib/store/calendar.store"

  export let viewId: Readable<string | undefined>
  export let view: CalendarView
  export let readonly = false
  export let shareId: string | undefined = undefined
  export let disableRecordQuery = false
  export let r: Writable<string | null>
  export let field: DateField | DateRangeField
  export let startDate: Readable<Date>
  export let days: number = 7

  let displayDates = derived(startDate, ($startDate) =>
    $startDate
      ? Array.from({ length: days }, (_, i) => {
          return addDays($startDate, i)
        })
      : [],
  )
</script>

<div class="relative flex h-full flex-1 overflow-hidden">
  <!-- 左侧时间轴 -->
  <div class="relative flex-1 overflow-y-auto">
    <div class="relative min-h-[1440px]">
      <!-- 添加日期头部 -->
      {#if days > 1}
        <div class="sticky top-0 z-10 ml-16 flex border-b border-l bg-white">
          {#each $displayDates as date}
            <div class="flex-1 border-r p-2 text-center">
              <div class="font-medium">{format(date, "EEE")}</div>
              <div class="text-sm text-gray-500">{format(date, "MMM d")}</div>
            </div>
          {/each}
        </div>
      {/if}

      <!-- 时间格子容器 -->
      <div class="flex">
        <!-- 时间轴标记 -->
        <div class="w-16 flex-none">
          {#each HOURS as hour, index}
            <div class="relative h-[60px]">
              <div class={cn("absolute -top-2 left-2 text-xs font-medium text-gray-500", index === 0 && "top-0")}>
                {formatHour(hour)}
              </div>
            </div>
          {/each}
        </div>

        {#if $displayDates.length === 1}
          <CalendarViewDayTimeline
            date={startDate}
            {viewId}
            bind:view
            {r}
            {field}
            {shareId}
            {readonly}
            {disableRecordQuery}
          />
        {:else}
          {#each $displayDates as date (date.toISOString())}
            {#key date.toISOString()}
              <CalendarViewDayTimeline
                date={readable(date)}
                {viewId}
                bind:view
                {r}
                {field}
                {shareId}
                {readonly}
                {disableRecordQuery}
              />
            {/key}
          {/each}
        {/if}
      </div>
    </div>
  </div>

  <!-- 右侧面板 -->
  <div class="flex h-full w-[300px] flex-col divide-y border-l border-gray-200">
    <div class="flex-1 overflow-y-auto">
      <CalendarViewMonthRecords bind:view {r} {viewId} {field} {shareId} {readonly} />
    </div>
  </div>
</div>
