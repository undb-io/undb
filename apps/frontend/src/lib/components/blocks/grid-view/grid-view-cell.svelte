<script lang="ts">
  import type { Field, FieldType } from "@undb/table"
  import type { ComponentType } from "svelte"
  import StringCell from "./editable-cell/string-cell.svelte"
  import TextCell from "./editable-cell/text-cell.svelte"
  import IdCell from "./editable-cell/id-cell.svelte"
  import { createMutation } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { getTable } from "$lib/store/table.store"

  const table = getTable()

  export let value: any
  export let index: number
  export let field: Field
  export let recordId: string

  const map: Record<FieldType, ComponentType> = {
    string: StringCell,
    number: StringCell,
    id: IdCell,
    createdAt: TextCell,
    updatedAt: TextCell,
    autoIncrement: TextCell,
  }

  const updateRecord = createMutation({
    mutationKey: [field.id.value, recordId],
    mutationFn: trpc.record.update.mutate,
  })
</script>

<svelte:component
  this={map[field.type]}
  bind:value
  {index}
  onValueChange={(value) => {
    $updateRecord.mutate({
      tableId: $table.id.value,
      id: recordId,
      values: { [field.id.value]: value },
    })
  }}
/>
