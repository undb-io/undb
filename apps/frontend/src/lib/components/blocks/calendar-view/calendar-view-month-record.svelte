<script lang="ts">
  import type { Field, RecordDO, DateField, DateRangeField } from "@undb/table"
  import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
  import { monthStore } from "$lib/store/calendar.store"
  import { type Writable } from "svelte/store"
  import { cn } from "$lib/utils"

  export let record: RecordDO
  export let defaultField: Field | undefined
  export let field: DateField | DateRangeField
  export let r: Writable<string | null>
  export let shareId: string | undefined
  export let readonly = false

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
</script>

<button
  use:setupDraggableDate={record}
  on:click={() => r.set(record.id.value)}
  class={cn("flex w-full items-center gap-1.5 space-y-2 rounded-sm border p-2 hover:shadow-md", $$restProps.class)}
>
  <div class="flex items-center gap-2">
    <div class="flex-1 space-y-1">
      <div class="text-left text-sm font-semibold text-gray-900">{defaultValue ?? "-"}</div>
      <div class="text-left text-xs text-gray-500">{value ? field.format(value) : ""}</div>
    </div>
  </div>
</button>
