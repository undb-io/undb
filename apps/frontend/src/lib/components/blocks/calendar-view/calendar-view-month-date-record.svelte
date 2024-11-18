<script lang="ts">
  import { type Writable } from "svelte/store"
  import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
  import type { Field, RecordDO, DateField, DateRangeField } from "@undb/table"
  import { monthStore } from "$lib/store/calendar.store"
  import { cn } from "$lib/utils"
  import { getTable } from "$lib/store/table.store"
  import type { ViewColor } from "@undb/table"
  import { getBgColor } from "../grid-view/grid-view.util"

  export let record: RecordDO
  export let displayField: Field | undefined
  export let field: DateField | DateRangeField
  export let r: Writable<string | null>
  export let date: Date
  export let readonly = false
  export let shareId: string | undefined
  export let color: ViewColor | undefined

  const table = getTable()

  function setupDraggableDate(node: HTMLElement, record: RecordDO) {
    function setup(record: RecordDO) {
      if (readonly || shareId) return

      draggable({
        element: node,
        getInitialData(args) {
          return {
            type: "calendar-date-drag",
            date,
            record,
          }
        },
        onDragStart(args) {
          monthStore.setIsDragging(true)
        },
        onDrop(args) {
          monthStore.setIsDragging(false)
        },
      })
    }

    setup(record)

    return {
      update: setup,
    }
  }

  $: displayValue = displayField
    ? record.getValue(displayField.id).into(undefined)?.value || record.getDisplayValue($table)
    : ""
  $: value = record.getValue(field.id).into(undefined)?.value
    ? field.format(record.getValue(field.id).into(undefined)?.value ?? "")
    : ""

  $: colorSpec = color?.getSpec($table.schema).into(undefined)
  $: isMatch = colorSpec ? record.match(colorSpec) : false
  $: condition = isMatch ? color?.getMatchedFieldConditions($table, record)[0] : undefined
</script>

<button
  class={cn(
    "relative h-[20px] w-full overflow-hidden rounded-sm border border-blue-200 bg-blue-50 px-1 py-0.5 text-left text-[10px] text-blue-800 transition-all hover:bg-blue-100 hover:shadow-md",
    $$restProps.class,
    isMatch && "pl-3",
  )}
  on:click={() => r.set(record.id.value)}
  use:setupDraggableDate={record}
>
  {#if isMatch}
    <div class={cn("absolute left-0 top-0 h-full w-1", condition && getBgColor(condition.option.color))}></div>
  {/if}
  <span class="truncate">
    <div class="flex items-center gap-1 truncate">
      <span class="font-semibold">
        {displayValue}
      </span>
      <span> · </span>
      <span>
        {value}
      </span>
    </div>
  </span>
</button>
