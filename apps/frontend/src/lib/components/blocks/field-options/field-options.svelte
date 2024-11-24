<script lang="ts">
  import type { Field, IFieldConstraint, NoneSystemFieldType } from "@undb/table"
  import type { ComponentType } from "svelte"
  import StringFieldOption from "./string-field-option.svelte"
  import EmailFieldOption from "./email-field-option.svelte"
  import NumberFieldOption from "./number-field-option.svelte"
  import ReferenceFieldOption from "./reference-field-option.svelte"
  import RollupFieldOption from "./rollup-field-option.svelte"
  import SelectFieldOption from "./select-field-option.svelte"
  import RatingFieldOption from "./rating-field-option.svelte"
  import AttachmentFieldOption from "./attachment-field-option.svelte"
  import UserFieldOption from "./user-field-option.svelte"
  import CheckboxFieldOption from "./checkbox-field-option.svelte"
  import JsonFieldOption from "./json-field-option.svelte"
  import DateFieldOption from "./date-field-option.svelte"
  import UrlFieldOption from "./url-field-option.svelte"
  import LongTextFieldOption from "./long-text-field-option.svelte"
  import CurrencyFieldOption from "./currency-field-option.svelte"
  import ButtonFieldOption from "./button-field-option.svelte"
  import DurationFieldOption from "./duration-field-option.svelte"
  import PercentageFieldOption from "./percentage-field-option.svelte"
  import FormulaFieldOption from "./formula-field-option.svelte"
  import DateRangeFieldOption from "./date-range-field-option.svelte"

  export let constraint: IFieldConstraint | undefined
  export let option: any | undefined
  export let display: boolean | undefined
  export let defaultValue: any | undefined
  export let isNew = true
  export let field: Field | undefined = undefined
  export let disabled = false
  export let type: NoneSystemFieldType

  const map: Record<NoneSystemFieldType, ComponentType> = {
    string: StringFieldOption,
    longText: LongTextFieldOption,
    number: NumberFieldOption,
    currency: CurrencyFieldOption,
    reference: ReferenceFieldOption,
    rollup: RollupFieldOption,
    select: SelectFieldOption,
    rating: RatingFieldOption,
    attachment: AttachmentFieldOption,
    user: UserFieldOption,
    email: EmailFieldOption,
    button: ButtonFieldOption,
    url: UrlFieldOption,
    checkbox: CheckboxFieldOption,
    json: JsonFieldOption,
    date: DateFieldOption,
    duration: DurationFieldOption,
    percentage: PercentageFieldOption,
    formula: FormulaFieldOption,
    dateRange: DateRangeFieldOption,
  }

  $: component = map[type]
</script>

<svelte:component
  this={component}
  {disabled}
  bind:constraint
  bind:display
  bind:defaultValue
  bind:option
  {isNew}
  {field}
  {...$$restProps}
/>
