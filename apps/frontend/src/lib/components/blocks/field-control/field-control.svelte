<script lang="ts">
  import type { NoneSystemField, NoneSystemFieldType } from "@undb/table"
  import StringControl from "./string-control.svelte"
  import NumberControl from "./number-control.svelte"
  import type { ComponentType } from "svelte"
  import DateControl from "./date-control.svelte"
  import UserControl from "./user-control.svelte"
  import ReferenceControl from "./reference-control.svelte"
  import SelectControl from "./select-control.svelte"
  import RatingControl from "./rating-control.svelte"
  import EmailControl from "./email-control.svelte"
  import AttachmentControl from "./attachment-control.svelte"
  import JsonControl from "./json-control.svelte"
  import CheckboxControl from "./checkbox-control.svelte"

  export let readonly = false
  export let field: NoneSystemField
  export let tableId: string
  export let recordId: string | undefined

  export let value: any
  export let displayValue: any

  function handleValue() {
    const { success } = field.valueSchema.safeParse(value)
    if (!success) {
      value = undefined
    }
  }

  $: field, handleValue()

  const map: Record<NoneSystemFieldType, ComponentType> = {
    string: StringControl,
    number: NumberControl,
    reference: ReferenceControl,
    rollup: NumberControl,
    select: SelectControl,
    rating: RatingControl,
    email: EmailControl,
    attachment: AttachmentControl,
    date: DateControl,
    json: JsonControl,
    checkbox: CheckboxControl,
    user: UserControl,
  }
</script>

<svelte:component
  this={map[field.type]}
  {readonly}
  on:change
  {...$$restProps}
  bind:value
  {displayValue}
  {field}
  {tableId}
  {recordId}
/>
