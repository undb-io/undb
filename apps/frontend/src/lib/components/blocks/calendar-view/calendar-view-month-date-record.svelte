<script lang="ts">
  import { type Writable } from "svelte/store"
  import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
  import type { Field, RecordDO, DateField, DateRangeField, IColors } from "@undb/table"
  import { calendarStore } from "$lib/store/calendar.store"
  import { cn } from "$lib/utils"
  import { getTable } from "$lib/store/table.store"
  import type { ViewColor } from "@undb/table"
  import { getColor } from "./calendar-view.util"
  import * as Tooltip from "$lib/components/ui/tooltip"

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

<Tooltip.Root>
  <Tooltip.Trigger class="w-full">
    <button
      class={cn(
        "h-[20px] w-full overflow-hidden rounded-sm border border-gray-300 px-1 py-0.5 text-left text-[10px]  transition-all  hover:shadow-md",
        $$restProps.class,
        isMatch && getColor(condition?.option.color),
      )}
      on:click={(e) => {
        e.stopPropagation()
        r.set(record.id.value)
      }}
      use:setupDraggableDate={record}
    >
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
  </Tooltip.Trigger>
  <Tooltip.Content>
    <p>{displayValue} · {value}</p>
  </Tooltip.Content>
</Tooltip.Root>
