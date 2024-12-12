<script lang="ts">
  import { Trash2Icon } from "lucide-svelte"
  import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
  import { type RecordDO, CalendarView, DateFieldValue, FieldIdVo } from "@undb/table"
  import { getRecordsStore } from "$lib/store/records.store"
  import { getTable } from "$lib/store/table.store"
  import { createMutation } from "@tanstack/svelte-query"
  import { useQueryClient } from "@tanstack/svelte-query"
  import { cn } from "$lib/utils"
  import { calendarStore } from "$lib/store/calendar.store"
  import { getDataService } from "$lib/store/data-service.store"
  import { type IUpdateRecordCommand } from "@undb/commands"

  export let view: CalendarView

  const store = getRecordsStore()
  const t = getTable()

  let fieldId = view.field.into(undefined)

  let field = fieldId ? $t.schema.getFieldById(new FieldIdVo(fieldId)).into(undefined) : undefined

  const dataService = getDataService()

  const updateRecord = createMutation({
    mutationFn: async (command: IUpdateRecordCommand) => {
      return dataService.records.updateRecord(command)
    },
  })

  const client = useQueryClient()

  let isDraggedOver = false

  function setupDropTarget(node: HTMLElement) {
    dropTargetForElements({
      element: node,
      getData(e) {
        return {
          type: "calendar-date-drop",
        }
      },
      onDragEnter(e) {
        isDraggedOver = true
      },
      onDragLeave(e) {
        isDraggedOver = false
      },
      async onDrop(args) {
        if (!field) return
        const data = args.source.data
        const type = data.type
        if (type !== "calendar-date-drag") {
          return
        }

        const record = data.record as RecordDO

        record.values.setValue(field.id, new DateFieldValue(null))
        store.setRecord(record)

        await $updateRecord.mutateAsync({
          tableId: $t.id.value,
          id: record.id.value,
          values: {
            [field.id.value]: null,
          },
        })
        await client.invalidateQueries({
          queryKey: ["records", $t?.id.value, view.id.value],
        })
      },
    })
  }
</script>

<button use:setupDropTarget class={cn("hidden transition-opacity", $calendarStore.isDragging && "block")}>
  <Trash2Icon class={cn("size-10 text-gray-600", isDraggedOver && "text-red-600")} />
</button>
