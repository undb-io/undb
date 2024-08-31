<script lang="ts">
  import type { Field, FieldType, RecordDO } from "@undb/table"
  import type { ComponentType } from "svelte"
  import StringCell from "./editable-cell/string-cell.svelte"
  import NumberCell from "./editable-cell/number-cell.svelte"
  import IdField from "../field-value/id-field.svelte"
  import DateField from "../field-value/date-field.svelte"
  import NumberField from "../field-value/number-field.svelte"
  import { cn } from "$lib/utils"
  import { isEditingCell, isSelectedCell } from "./grid-view.store"
  import SelectCell from "./editable-cell/select-cell.svelte"
  import { getTable } from "$lib/store/table.store"
  import DateCell from "./editable-cell/date-cell.svelte"
  import CheckboxCell from "./editable-cell/checkbox-cell.svelte"
  import UserCell from "./editable-cell/user-cell.svelte"
  import RatingCell from "./editable-cell/rating-cell.svelte"
  import EmailCell from "./editable-cell/email-cell.svelte"
  import JsonCell from "./editable-cell/json-cell.svelte"
  import AttachmentCell from "./editable-cell/attachment-cell.svelte"
  import ReferenceCell from "./editable-cell/reference-cell.svelte"
  import ReadonlyUserCell from "./editable-cell/readonly-user-cell.svelte"
  import { recordsStore } from "$lib/store/records.store"
  import UrlCell from "./editable-cell/url-cell.svelte"
  import RollupCell from "./editable-cell/rollup-cell.svelte"
  import LongTextCell from "./editable-cell/long-text-cell.svelte"
  import CurrencyCell from "./editable-cell/currency-cell.svelte"
  import ButtonCell from "./editable-cell/button-cell.svelte"

  const table = getTable()

  export let value: any
  export let displayValue: any
  export let index: number
  export let field: Field
  export let recordId: string
  export let record: RecordDO | undefined
  export let readonly: boolean

  $: isEditing = $isEditingCell(recordId, field.id.value)
  $: isSelected = $isSelectedCell(recordId, field.id.value)

  const map: Record<FieldType, ComponentType> = {
    string: StringCell,
    longText: LongTextCell,
    number: NumberCell,
    currency: CurrencyCell,
    id: IdField,
    createdAt: DateField,
    updatedAt: DateField,
    autoIncrement: NumberField,
    createdBy: ReadonlyUserCell,
    updatedBy: ReadonlyUserCell,
    reference: ReferenceCell,
    rollup: RollupCell,
    select: SelectCell,
    rating: RatingCell,
    email: EmailCell,
    button: ButtonCell,
    url: UrlCell,
    date: DateCell,
    json: JsonCell,
    checkbox: CheckboxCell,
    attachment: AttachmentCell,
    user: UserCell,
  }
</script>

<svelte:component
  this={map[field.type]}
  bind:value
  {displayValue}
  {field}
  {index}
  {isEditing}
  {isSelected}
  {recordId}
  {record}
  readonly={field.isSystem || readonly}
  tableId={$table.id.value}
  class={cn(
    "relative flex h-8 items-center border border-transparent px-2 py-1 text-xs",
    (isSelected || isEditing) && "border-primary",
  )}
  onValueChange={(v) => {
    value = v
    recordsStore.setRecordValue(recordId, field.id.value, v)
  }}
/>
