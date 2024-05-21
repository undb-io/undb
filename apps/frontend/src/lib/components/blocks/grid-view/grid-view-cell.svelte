<script lang="ts">
  import type { Field, FieldType } from "@undb/table"
  import type { ComponentType } from "svelte"
  import StringCell from "./editable-cell/string-cell.svelte"
  import NumberCell from "./editable-cell/number-cell.svelte"
  import TextCell from "./editable-cell/text-cell.svelte"
  import IdCell from "./editable-cell/id-cell.svelte"
  import { createMutation } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { getTable } from "$lib/store/table.store"
  import { toast } from "svelte-sonner"

  const table = getTable()

  export let value: any
  export let index: number
  export let field: Field
  export let recordId: string

  const map: Record<FieldType, ComponentType> = {
    string: StringCell,
    number: NumberCell,
    id: IdCell,
    createdAt: TextCell,
    updatedAt: TextCell,
    autoIncrement: TextCell,
  }

  let form: HTMLFormElement
  const updateRecord = createMutation({
    mutationKey: [field.id.value, recordId],
    mutationFn: trpc.record.update.mutate,
    onSuccess(data, variables, context) {
      form.querySelectorAll("input").forEach((input) => {
        input.blur()
      })
    },
    onError(error, variables, context) {
      toast.error(error.message)
    },
  })

  function handleSubmit() {
    $updateRecord.mutate({
      tableId: $table.id.value,
      id: recordId,
      values: { [field.id.value]: value },
    })
  }
</script>

<form on:submit|preventDefault|stopPropagation={handleSubmit} bind:this={form}>
  <svelte:component
    this={map[field.type]}
    bind:value
    {index}
    class="text-xs"
    onValueChange={(v) => {
      value = v
    }}
  />
</form>
