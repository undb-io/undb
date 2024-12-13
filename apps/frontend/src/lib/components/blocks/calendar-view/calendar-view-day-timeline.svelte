<script lang="ts">
  import {
    type IRecordsDTO,
    Records,
    type CalendarView,
    type DateField,
    type DateRangeField,
    DateFieldValue,
    RecordDO,
  } from "@undb/table"
  import { derived, type Readable } from "svelte/store"
  import type { Writable } from "svelte/store"
  import { calendarStore, HOURS } from "$lib/store/calendar.store"
  import { createRecordsStore, defaultRecordValues, setRecordsStore } from "$lib/store/records.store"
  import { trpc } from "$lib/trpc/client"
  import { createQuery } from "@tanstack/svelte-query"
  import { queryParam } from "sveltekit-search-params"
  import { onMount } from "svelte"
  import { cn } from "$lib/utils"
  import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
  import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
  import { format, isSameDay } from "date-fns"
  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { getTable } from "$lib/store/table.store"
  import { getColor } from "./calendar-view.util"
  import { isToday } from "date-fns"
  import * as Tooltip from "$lib/components/ui/tooltip"
  import { PlusIcon } from "lucide-svelte"
  import { CREATE_RECORD_MODAL, openModal } from "$lib/store/modal.store"
  import { tick } from "svelte"
  import { hasPermission } from "$lib/store/space-member.store"
  import { getDataService } from "$lib/store/data-service.store"
  import { type IUpdateRecordCommand } from "@undb/commands"

  export let viewId: Readable<string | undefined>
  export let view: CalendarView
  export let readonly = false
  export let shareId: string | undefined = undefined
  export let disableRecordQuery = false
  export let r: Writable<string | null>
  export let field: DateField | DateRangeField
  export let date: Readable<Date>

  const table = getTable()
  $: color = view.color.into(undefined)

  // 计算事件位置和高度
  function calculateTopPosition(date: string): number {
    const eventDate = new Date(date)
    const hours = eventDate.getHours()
    const minutes = eventDate.getMinutes()
    return hours * 60 + minutes
  }

  function calculateHeight(startDate: string, endDate: string): number {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const durationInMinutes = (end.getTime() - start.getTime()) / (1000 * 60)
    return Math.max(durationInMinutes, 30) // 最小高度30px
  }

  // 当前时间线
  let currentTimePosition = 0
  let currentTimeInterval: NodeJS.Timer

  $: displayField = $table.schema.getDefaultDisplayField().into(undefined)

  $: if (!currentTimePosition) {
    updateCurrentTime()
  }

  onMount(() => {
    if (isToday($date)) {
      updateCurrentTime()
      currentTimeInterval = setInterval(updateCurrentTime, 60000) // 每分钟更新一次

      return () => {
        clearInterval(currentTimeInterval)
      }
    }
  })

  let now: Date | undefined = undefined
  // 添加选中时间状态
  let selectedHour: number | null = null

  // 处理时间格子点击
  function handleTimeSlotClick(hour: number) {
    calendarStore.setSelectedDate(new Date($date))
    selectedHour = hour
  }

  function getIsSelected(hour: number) {
    return selectedHour !== null && isSameDay($calendarStore.selectedDate, $date) && hour === selectedHour
  }

  function updateCurrentTime() {
    now = new Date()
    const minutes = now.getHours() * 60 + now.getMinutes()
    selectedHour = now.getHours()
    currentTimePosition = minutes
  }

  // 数据获取相关代码
  const t = getTable()
  const q = queryParam("q")

  const dataService = getDataService()

  const getRecords = createQuery(
    derived([t, viewId, q, date], ([$table, $viewId, $q, $date]) => {
      const view = $table.views.getViewById($viewId)
      return {
        queryKey: ["records", $table?.id.value, $viewId, $q, $date.toISOString()],
        enabled: view?.type === "calendar" && !disableRecordQuery,
        queryFn: async () => {
          const value = format($date, "yyyy-MM-dd")
          if (shareId) {
            return trpc.shareData.records.query({
              shareId,
              tableId: $table?.id.value,
              viewId: $viewId,
              q: $q ?? undefined,
              filters: {
                conjunction: "and",
                children: [{ field: field.id.value, op: "is_same_day", value }],
              },
            })
          }
          return dataService.records.getRecords({
            tableId: $table?.id.value,
            viewId: $viewId,
            filters: {
              conjunction: "and",
              children: [{ field: field.id.value, op: "is_same_day", value }],
            },
          })
        },
      }
    }),
  )

  $: records = (($getRecords.data as any)?.records as IRecordsDTO) ?? []

  const store = createRecordsStore()
  setRecordsStore(store)

  $: if ($getRecords.isSuccess) {
    store.setRecords(Records.fromJSON($t, records), $getRecords.dataUpdatedAt)
  }

  // 添加新的类型和函数
  interface EventPosition {
    record: RecordDO
    recordId: string
    start: Date
    end: Date
    top: number
    height: number
    column: number
    totalColumns: number
  }

  // 计算事件位置和高度的函数需要考虑多天的情况
  function calculateEventPositions(
    records: Array<[string, RecordDO]>,
    draggedRecord?: RecordDO,
    previewTime?: { hour: number; minutes: number },
  ): EventPosition[] {
    if (!records.length && !draggedRecord) return []

    const positions: EventPosition[] = []

    // 首先计算每个事件的基础位置信息，排除被拖拽的记录
    records.forEach(([recordId, record]) => {
      if (draggedRecord && record.id.value === draggedRecord.id.value) return

      const startDate = record.values.getValue(field.id).into(undefined)?.value
      if (!startDate) return

      const start = new Date(startDate)
      // 检查事件是否在显示的日期范围内

      const end = new Date(start.getTime() + 60 * 60 * 1000)

      positions.push({
        record,
        recordId,
        start,
        end,
        top: calculateTopPosition(startDate),
        height: calculateHeight(startDate, end.toISOString()),
        column: 0,
        totalColumns: 1,
      })
    })

    // 如果有预览记录，添加到位置列表中
    if (draggedRecord && previewTime) {
      const previewDate = new Date($date)
      previewDate.setHours(previewTime.hour, previewTime.minutes, 0, 0)
      const previewEndDate = new Date(previewDate.getTime() + 60 * 60 * 1000)

      positions.push({
        record: draggedRecord,
        recordId: draggedRecord.id.value,
        start: previewDate,
        end: previewEndDate,
        top: calculateTopPosition(previewDate.toISOString()),
        height: calculateHeight(previewDate.toISOString(), previewEndDate.toISOString()),
        column: 0,
        totalColumns: 1,
      })
    }

    // 按开始时间排序
    positions.sort((a, b) => a.start.getTime() - b.start.getTime())

    // 创建重叠组
    const groups: EventPosition[][] = []

    for (const position of positions) {
      let foundGroup = false
      for (const group of groups) {
        const hasOverlap = group.some(
          (groupEvent) => !(position.end <= groupEvent.start || position.start >= groupEvent.end),
        )

        if (hasOverlap) {
          group.push(position)
          foundGroup = true
          break
        }
      }

      if (!foundGroup) {
        groups.push([position])
      }
    }

    // 为每个组分配列位置
    groups.forEach((group) => {
      const totalColumns = group.length
      group.forEach((event, columnIndex) => {
        event.column = columnIndex
        event.totalColumns = totalColumns
      })
    })

    return positions
  }

  let aboutToDropRecord: RecordDO | undefined = undefined
  let overHour: number | undefined = undefined
  let overMinutes: number | undefined = undefined

  const updateRecord = createMutation({
    mutationFn: dataService.records.updateRecord,
  })

  const client = useQueryClient()

  function setupDraggableDate(node: HTMLElement, record: RecordDO) {
    if (readonly || shareId) return

    function setup(record: RecordDO) {
      draggable({
        element: node,
        getInitialData(args) {
          return {
            type: "calendar-date-drag",
            record,
          }
        },
        onDragStart(args) {
          calendarStore.setIsDragging(true)
        },
        onDrop(args) {
          calendarStore.setIsDragging(false)
        },
      })
    }

    setup(record)

    return {
      update: setup,
    }
  }

  function calculateMinutesFromPosition(element: HTMLElement, { y }: { y: number }): number {
    if (!y) return 0

    const rect = element.getBoundingClientRect()
    const relativeY = y - rect.top
    const percentage = Math.max(0, Math.min(1, relativeY / rect.height))
    const exactMinutes = Math.floor(percentage * 60)

    // 舍入到最近的15分钟
    const roundedMinutes = Math.round(exactMinutes / 15) * 15
    return Math.min(roundedMinutes, 45) // 确保不超过45分钟
  }

  function setupDropTarget(node: HTMLElement, hour: number) {
    if (readonly || shareId) return

    function setup(hour: number) {
      dropTargetForElements({
        element: node,
        getData(e) {
          return {
            type: "calendar-date-drop",
            hour,
          }
        },
        onDragEnter(args) {
          const record = args.source.data.record as RecordDO
          const { clientY } = args.location.current.input
          const minutes = calculateMinutesFromPosition(node, { y: clientY })
          aboutToDropRecord = record
          overHour = hour
          overMinutes = minutes
        },
        onDrag(args) {
          if (overHour === hour) {
            const { clientY } = args.location.current.input
            overMinutes = calculateMinutesFromPosition(node, { y: clientY })
          }
        },
        onDragLeave() {
          aboutToDropRecord = undefined
          overHour = undefined
          overMinutes = undefined
        },
        async onDrop(args) {
          aboutToDropRecord = undefined
          overHour = undefined
          overMinutes = undefined

          const data = args.source.data
          const type = data.type
          if (type !== "calendar-date-drag") {
            return
          }

          const record = data.record as RecordDO
          const hour = args.self.data.hour as number

          const { clientY } = args.location.current.input
          const minutes = calculateMinutesFromPosition(node, { y: clientY })

          const dt = new Date($date)
          dt.setHours(hour, minutes, 0, 0)
          const d = format(dt, "yyyy-MM-dd HH:mm")

          record.values.setValue(field.id, new DateFieldValue(d))
          store.setRecord(record)

          await $updateRecord.mutateAsync({
            tableId: $table.id.value,
            id: record.id.value,
            values: {
              [field.id.value]: dt.toISOString(),
            },
          })
          await client.invalidateQueries({
            queryKey: ["records", $table.id.value, $viewId],
          })
        },
      })
    }

    setup(hour)

    return {
      update: setup,
    }
  }
</script>

<div class="relative flex-1">
  {#each HOURS as hour}
    {@const isSelected = getIsSelected(hour)}
    <!-- svelte-ignore a11y-click-events-have-key_events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      use:setupDropTarget={hour}
      class={cn(
        "group relative h-[60px] border border-b border-r-0 border-t border-gray-100 border-b-transparent first:border-t-0 hover:bg-gray-50",
        isSelected && "border-2 border-blue-500",
      )}
      style="z-index: {$calendarStore.isDragging ? 2 : 0};"
      on:click={() => handleTimeSlotClick(hour)}
    >
      <!-- 半小时分隔线 -->
      <div class="absolute top-[30px] w-full border-t border-gray-50"></div>
      {#if !shareId && $hasPermission("record:create")}
        <button
          type="button"
          class={cn(
            "absolute right-2 top-1/2 z-50 hidden size-6 -translate-y-1/2 items-center justify-center rounded-sm border group-hover:flex",
            isSelected && "flex",
          )}
          on:click={async (e) => {
            e.stopPropagation()
            const d = new Date($date)
            d.setHours(hour)
            d.setMinutes(0)
            d.setSeconds(0)
            d.setMilliseconds(0)
            defaultRecordValues.set({
              [field.id.value]: d.toISOString(),
            })
            await tick()
            setTimeout(() => {
              openModal(CREATE_RECORD_MODAL)
            }, 0)
          }}
        >
          <PlusIcon class="size-4 text-gray-500" />
        </button>
      {/if}
    </div>
  {/each}

  <div class="pointer-events-none absolute inset-0">
    <!-- 留出左侧时间轴空间 -->
    <!-- 当前时间线 -->
    {#if isToday($date) && now}
      <div class="pointer-events-none absolute left-0 right-0 z-10" style="top: {currentTimePosition}px;">
        <div class="relative border-t-2 border-red-500">
          <div class="absolute -left-2 -top-1.5 size-3 rounded-full bg-red-500"></div>
          <div
            class="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded bg-red-500 px-2 py-0.5 text-xs text-white"
          >
            {now?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
          <div class="absolute -right-2 -top-1.5 size-3 rounded-full bg-red-500"></div>
        </div>
      </div>
    {/if}

    <!-- 新的事件渲染逻辑 -->
    {#if $store.records}
      {@const eventPositions = calculateEventPositions(
        Array.from($store.records.entries()),
        aboutToDropRecord,
        overHour !== undefined && overMinutes !== undefined ? { hour: overHour, minutes: overMinutes } : undefined,
      )}
      {#each eventPositions as position}
        {@const displayValue = displayField
          ? position.record.getValue(displayField.id).into(undefined)?.value || position.record.getDisplayValue($table)
          : "Untitled"}
        {@const colorSpec = color?.getSpec($table.schema).into(undefined)}
        {@const isMatch = colorSpec ? position.record.match(colorSpec) : false}
        {@const condition = isMatch ? color?.getMatchedFieldConditions($table, position.record)[0] : undefined}
        {@const title =
          field.type === "date"
            ? `${position.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
            : `${position.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${position.end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
        <div
          use:setupDraggableDate={position.record}
          class={cn(
            "pointer-events-auto absolute left-2 right-2 overflow-hidden",
            $calendarStore.isDragging && "pointer-events-none", // 拖拽时禁用指针事件
            aboutToDropRecord?.id.value === position.record.id.value && "opacity-50",
          )}
          style="
					top: {position.top}px;
					height: {position.height}px;
					left: calc({(position.column * 100) / position.totalColumns}% + 2px);
					width: calc({100 / position.totalColumns}% - 4px);
					z-index: {$calendarStore.isDragging ? 3 : 4}; /* 拖拽时降低z-index */
				"
        >
          <button
            title={displayValue}
            type="button"
            class={cn(
              "h-full w-full cursor-pointer rounded border bg-white p-2 text-left text-sm shadow-sm hover:shadow-md",
              isMatch && getColor(condition?.option.color),
            )}
            on:click={() => {
              $r = position.record.id.value
            }}
          >
            <div class={cn("truncate font-semibold", !displayValue && "text-gray-500")}>
              {displayValue}
            </div>
            <Tooltip.Root>
              <Tooltip.Trigger type="button" class="w-full overflow-hidden text-left">
                <span class="truncate text-xs">
                  {title}
                </span>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p>{title}</p>
              </Tooltip.Content>
            </Tooltip.Root>
          </button>
        </div>
      {/each}
    {/if}
  </div>
</div>
