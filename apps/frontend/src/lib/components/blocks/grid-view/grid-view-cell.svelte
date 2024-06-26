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
  import { derived } from "svelte/store"
  import UserField from "../field-value/user-field.svelte"
  import ReferenceControl from "../field-control/reference-control.svelte"
  import RollupField from "../field-value/rollup-field.svelte"
  import SelectControl from "../field-control/select-control.svelte"
  import RatingControl from "../field-control/rating-control.svelte"

  const table = getTable()

  export let value: any
  export let displayValue: any
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
    createdBy: UserField,
    updatedBy: UserField,
    reference: ReferenceControl,
    rollup: RollupField,
    select: SelectControl,
    rating: RatingControl,
  }

  let form: HTMLFormElement

  const updateRecord = createMutation(
    derived([table], ([$table]) => ({
      mutationKey: ["record", $table.id.value, field.id.value, recordId],
      mutationFn: trpc.record.update.mutate,
      onSuccess() {
        form.querySelectorAll("input").forEach((input) => {
          input.blur()
        })
      },
      onError(error: Error) {
        toast.error(error.message)
      },
    })),
  )

  function handleSubmit() {
    $updateRecord.mutate({
      tableId: $table.id.value,
      id: recordId,
      values: { [field.id.value]: value },
    })
  }
</script>

<form
  on:submit|preventDefault|stopPropagation={handleSubmit}
  bind:this={form}
  class={cn("text-xs", !field.isMutable && "px-2")}
>
  <svelte:component
    this={map[field.type]}
    bind:value
    {displayValue}
    {field}
    {index}
    onValueChange={(v) => {
      value = v
    }}
  />
</form>
