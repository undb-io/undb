<script lang="ts">
  import { type Writable } from "svelte/store"
  import { type Field, type FieldType } from "@undb/table"
  import type { ComponentType } from "svelte"
  import StringField from "./string-field.svelte"
  import NumberField from "./number-field.svelte"
  import DateField from "./date-field.svelte"
  import IdField from "./id-field.svelte"
  import UserField from "./user-field.svelte"
  import RollupField from "./rollup-field.svelte"
  import ReferenceField from "./reference-field.svelte"
  import SelectField from "./select-field.svelte"
  import RatingField from "./rating-field.svelte"
  import AttachmentField from "./attachment-field.svelte"
  import JsonField from "./json-field.svelte"
  import CheckboxField from "./checkbox-field.svelte"
  import UrlField from "./url-field.svelte"
  import LongTextField from "./long-text-field.svelte"
  import CurrencyField from "./currency-field.svelte"
  import DurationField from "./duration-field.svelte"
  import PercentageField from "./percentage-field.svelte"
  import ButtonControl from "../field-control/button-control.svelte"
  import FormulaField from "./formula-field.svelte"
  import DateRangeField from "./date-range-field.svelte"

  export let type: FieldType
  export let value: any
  export let displayValue: any
  export let field: Field
  export let tableId: string
  export let recordId: string | undefined
  export let placeholder: string | undefined = undefined
  export let r: Writable<string | null>
  export let readonly: boolean = false

  const map: Record<FieldType, ComponentType> = {
    id: IdField,
    string: StringField,
    longText: LongTextField,
    number: NumberField,
    currency: CurrencyField,
    createdAt: DateField,
    updatedAt: DateField,
    autoIncrement: NumberField,
    createdBy: UserField,
    updatedBy: UserField,
    reference: ReferenceField,
    rollup: RollupField,
    select: SelectField,
    rating: RatingField,
    email: StringField,
    url: UrlField,
    attachment: AttachmentField,
    date: DateField,
    json: JsonField,
    checkbox: CheckboxField,
    user: UserField,
    duration: DurationField,
    percentage: PercentageField,
    formula: FormulaField,
    button: ButtonControl,
    dateRange: DateRangeField,
  }

  $: component = map[type]
</script>

<svelte:component
  this={component}
  {tableId}
  {recordId}
  {...$$restProps}
  {field}
  {value}
  {displayValue}
  {placeholder}
  {r}
  {readonly}
/>
