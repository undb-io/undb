<script lang="ts">
  import type { Field, FieldType } from "@undb/table"
  import type { ComponentType } from "svelte"
  import StringCell from "./editable-cell/string-cell.svelte"
  import NumberCell from "./editable-cell/number-cell.svelte"
  import { createMutation } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { getTable } from "$lib/store/table.store"
  import { toast } from "svelte-sonner"
  import IdField from "../field-value/id-field.svelte"
  import DateField from "../field-value/date-field.svelte"
  import NumberField from "../field-value/number-field.svelte"
  import { cn } from "$lib/utils"

  const table = getTable()

  export let value: any
  export let index: number
  export let field: Field
  export let recordId: string

  const map: Record<FieldType, ComponentType> = {
    string: StringCell,
    number: NumberCell,
    id: IdField,
    createdAt: DateField,
    updatedAt: DateField,
    autoIncrement: NumberField,
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
    class={cn("text-xs", !field.isMutable && "px-2")}
    onValueChange={(v) => {
      value = v
    }}
  />
</form>
