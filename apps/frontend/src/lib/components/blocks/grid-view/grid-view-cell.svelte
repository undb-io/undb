<script lang="ts">
  import type { Field, FieldType } from "@undb/table"
  import type { ComponentType } from "svelte"
  import StringCell from "./editable-cell/string-cell.svelte"
  import NumberCell from "./editable-cell/number-cell.svelte"
  import IdField from "../field-value/id-field.svelte"
  import DateField from "../field-value/date-field.svelte"
  import NumberField from "../field-value/number-field.svelte"
  import CheckboxField from "../field-value/checkbox-field.svelte"
  import { cn } from "$lib/utils"
  import UserField from "../field-value/user-field.svelte"
  import ReferenceControl from "../field-control/reference-control.svelte"
  import RollupField from "../field-value/rollup-field.svelte"
  import RatingControl from "../field-control/rating-control.svelte"
  import EmailControl from "../field-control/email-control.svelte"
  import JsonField from "../field-value/json-field.svelte"
  import AttachmentField from "../field-value/attachment-field.svelte"
  import { isEditingCell, isSelectedCell } from "./grid-view.store"
  import SelectCell from "./editable-cell/select-cell.svelte"
  import { getTable } from "$lib/store/table.store"
  import DateCell from "./editable-cell/date-cell.svelte"

  const table = getTable()

  export let value: any
  export let displayValue: any
  export let index: number
  export let field: Field
  export let recordId: string

  $: isEditing = $isEditingCell(recordId, field.id.value)
  $: isSelected = $isSelectedCell(recordId, field.id.value)

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
    select: SelectCell,
    rating: RatingControl,
    email: EmailControl,
    date: DateCell,
    json: JsonField,
    checkbox: CheckboxField,
    attachment: AttachmentField,
  }
</script>

<svelte:component
  this={map[field.type]}
  bind:value
  {displayValue}
  {field}
  {index}
  {isEditing}
  {recordId}
  tableId={$table.id.value}
  class={cn("flex h-8 items-center px-2 py-1 text-xs", (isSelected || isEditing) && "border-primary border")}
  onValueChange={(v) => {
    value = v
  }}
/>
