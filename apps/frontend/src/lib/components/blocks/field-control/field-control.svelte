<script lang="ts">
  import type { NoneSystemField, NoneSystemFieldType, RecordDO } from "@undb/table"
  import StringControl from "./string-control.svelte"
  import NumberControl from "./number-control.svelte"
  import type { Component } from "svelte"
  import DateControl from "./date-control.svelte"
  import UserControl from "./user-control.svelte"
  import ReferenceControl from "./reference-control.svelte"
  import SelectControl from "./select-control.svelte"
  import RatingControl from "./rating-control.svelte"
  import EmailControl from "./email-control.svelte"
  import AttachmentControl from "./attachment-control.svelte"
  import JsonControl from "./json-control.svelte"
  import CheckboxControl from "./checkbox-control.svelte"
  import UrlControl from "./url-control.svelte"
  import RollupField from "../field-value/rollup-field.svelte"
  import FormulaField from "../field-value/formula-field.svelte"
  import LongTextControl from "./long-text-control.svelte"
  import CurrencyControl from "./currency-control.svelte"
  import ButtonControl from "./button-control.svelte"
  import DurationControl from "./duration-control.svelte"
  import PercentageControl from "./percentage-control.svelte"
  import DateRangeControl from "./date-range-control.svelte"
  import { type Writable } from "svelte/store"
  import { onMount } from "svelte"

  export let readonly = false
  export let field: NoneSystemField
  export let tableId: string
  export let recordId: string | undefined
  export let record: RecordDO | undefined
  export let r: Writable<string | null>
  export let value: any
  export let displayValue: any
  export let onValueChange: (value: any) => void

  function handleValue() {
    const { success } = field.valueSchema.safeParse(value)
    if (!success) {
      value = undefined
    }
  }

  onMount(() => {
    if (field) {
      handleValue()
    }
  })

  const map: Record<NoneSystemFieldType, Component> = {
    string: StringControl,
    currency: CurrencyControl,
    longText: LongTextControl,
    number: NumberControl,
    button: ButtonControl,
    reference: ReferenceControl,
    rollup: RollupField,
    select: SelectControl,
    rating: RatingControl,
    email: EmailControl,
    url: UrlControl,
    attachment: AttachmentControl,
    date: DateControl,
    json: JsonControl,
    checkbox: CheckboxControl,
    formula: FormulaField,
    user: UserControl,
    duration: DurationControl,
    percentage: PercentageControl,
    dateRange: DateRangeControl,
  }
</script>

<svelte:component
  this={map[field.type]}
  {readonly}
  {...$$restProps}
  bind:value
  {displayValue}
  {field}
  {tableId}
  {recordId}
  {record}
  {r}
  {onValueChange}
/>
