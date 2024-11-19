<script lang="ts">
  import type { Field, RecordDO, DateField, DateRangeField } from "@undb/table"
  import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
  import { calendarStore } from "$lib/store/calendar.store"
  import { type Writable } from "svelte/store"
  import { cn } from "$lib/utils"
  import { getTable } from "$lib/store/table.store"
  import { ViewColor } from "@undb/table"
  import { getBgColor } from "../grid-view/grid-view.util"

  const table = getTable()

  export let record: RecordDO
  export let defaultField: Field | undefined
  export let field: DateField | DateRangeField
  export let r: Writable<string | null>
  export let shareId: string | undefined
  export let readonly = false
  export let color: ViewColor | undefined

  let defaultValue = defaultField ? (record.getValue(defaultField.id).into(undefined)?.value ?? undefined) : undefined
  let value = record.getValue(field.id).into(undefined)?.value ?? ""
  function setupDraggableDate(node: HTMLElement, record: RecordDO) {
    function setup(record: RecordDO) {
      if (readonly || shareId) return

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

  $: colorSpec = color?.getSpec($table.schema).into(undefined)
  $: isMatch = colorSpec ? record.match(colorSpec) : false
  $: condition = isMatch ? color?.getMatchedFieldConditions($table, record)[0] : undefined
</script>

<button
  use:setupDraggableDate={record}
  on:click={() => r.set(record.id.value)}
  class={cn(
    "relative flex w-full items-center gap-1.5 rounded-sm border p-2 hover:shadow-md",
    $$restProps.class,
    isMatch && "pl-3",
  )}
>
  {#if isMatch}
    <div class={cn("absolute left-0 top-0 h-full w-1", condition && getBgColor(condition.option.color))}></div>
  {/if}
  <div class="flex items-center gap-2 space-y-2">
    <div class="flex-1 space-y-1">
      <div class="text-left text-sm font-semibold text-gray-900">{defaultValue ?? "-"}</div>
      <div class="text-left text-xs text-gray-500">{value ? field.format(value) : ""}</div>
    </div>
  </div>
</button>
