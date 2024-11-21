<script lang="ts">
  import {
    SelectField,
    type Field,
    type IAutoIncrementFieldConditionOp,
    type ICheckboxFieldConditionOp,
    type ICreatedAtFieldConditionOp,
    type ICreatedByFieldConditionOp,
    type ICurrencyFieldConditionOp,
    type IDateFieldConditionOp,
    type IDurationFieldConditionOp,
    type IEmailFieldConditionOp,
    type IIdFieldConditionOp,
    type IJsonFieldConditionOp,
    type ILongTextFieldConditionOp,
    type INumberFieldConditionOp,
    type IOpType,
    type IPercentageFieldConditionOp,
    type IRatingFieldConditionOp,
    type ISelectFieldConditionOp,
    type IStringFieldConditionOp,
    type IUpdatedAtFieldConditionOp,
    type IUpdatedByFieldConditionOp,
    type IUrlFieldConditionOp,
    type IUserFieldConditionOp,
  } from "@undb/table"
  import Input from "$lib/components/ui/input/input.svelte"
  import { cn } from "$lib/utils"
  import type { ComponentType } from "svelte"
  import NumberInput from "$lib/components/ui/input/number-input.svelte"
  import DateControl from "$lib/components/blocks/field-control/date-control.svelte"
  import JsonDropdown from "../json/json-dropdown.svelte"
  import UserFilterInput from "./variants/user-filter-input.svelte"
  import IdFilterInput from "./variants/id-filter-input.svelte"
  import OptionFilterInput from "./variants/option-filter-input.svelte"
  import OptionsFilterInput from "./variants/options-filter-input.svelte"
  import DurationInput from "$lib/components/blocks/duration/duration-input.svelte"
  import StringControl from "$lib/components/blocks/field-control/string-control.svelte"

  export let field: Field | undefined
  export let recordId: string | undefined = undefined
  export let value: any | undefined = undefined
  export let displayValue: any | undefined = undefined
  export let op: IOpType | undefined = undefined
  export let disabled = false

  export let onValueChange: ((value: any) => void) | undefined = undefined

  const className = cn("h-8 rounded-l-none border-l-0 py-0 text-xs bg-background", $$restProps.class)

  const string: Record<IStringFieldConditionOp, ComponentType | null> = {
    eq: StringControl,
    neq: StringControl,
    contains: StringControl,
    does_not_contain: StringControl,
    starts_with: StringControl,
    ends_with: StringControl,
    is_empty: null,
    is_not_empty: null,
    min: NumberInput,
    max: NumberInput,
  }

  const number: Record<INumberFieldConditionOp, ComponentType | null> = {
    eq: NumberInput,
    neq: NumberInput,
    gt: NumberInput,
    gte: NumberInput,
    lt: NumberInput,
    lte: NumberInput,
    is_empty: null,
    is_not_empty: null,
  }

  const currency: Record<ICurrencyFieldConditionOp, ComponentType | null> = {
    eq: NumberInput,
    neq: NumberInput,
    gt: NumberInput,
    gte: NumberInput,
    lt: NumberInput,
    lte: NumberInput,
    is_empty: null,
    is_not_empty: null,
  }

  const date: Record<IDateFieldConditionOp, ComponentType | null> = {
    is_same_day: DateControl,
    is_not_same_day: DateControl,
    is_tody: null,
    is_not_today: null,
    is_after_today: null,
    is_before_today: null,
    is_tomorrow: null,
    is_not_tomorrow: null,
    is_after_tomorrow: null,
    is_before_tommorow: null,
    is_yesterday: null,
    is_not_yesterday: null,
    is_after_yesterday: null,
    is_before_yesterday: null,
    is_before: DateControl,
    is_not_before: DateControl,
    is_after: DateControl,
    is_not_after: DateControl,
    is_empty: null,
    is_not_empty: null,
  }

  const dateRange = date

  const createdAt: Record<ICreatedAtFieldConditionOp, ComponentType | null> = {
    is_same_day: DateControl,
    is_not_same_day: DateControl,
    is_tody: null,
    is_not_today: null,
    is_after_today: null,
    is_before_today: null,
    is_tomorrow: null,
    is_not_tomorrow: null,
    is_after_tomorrow: null,
    is_before_tommorow: null,
    is_yesterday: null,
    is_not_yesterday: null,
    is_after_yesterday: null,
    is_before_yesterday: null,
    is_before: DateControl,
    is_not_before: DateControl,
    is_after: DateControl,
    is_not_after: DateControl,
    is_empty: null,
    is_not_empty: null,
  }

  const updatedAt: Record<IUpdatedAtFieldConditionOp, ComponentType | null> = {
    is_same_day: DateControl,
    is_not_same_day: DateControl,
    is_tody: null,
    is_not_today: null,
    is_after_today: null,
    is_before_today: null,
    is_tomorrow: null,
    is_not_tomorrow: null,
    is_after_tomorrow: null,
    is_before_tommorow: null,
    is_yesterday: null,
    is_not_yesterday: null,
    is_after_yesterday: null,
    is_before_yesterday: null,
    is_before: DateControl,
    is_not_before: DateControl,
    is_after: DateControl,
    is_not_after: DateControl,
    is_empty: null,
    is_not_empty: null,
  }

  const rating: Record<IRatingFieldConditionOp, ComponentType | null> = {
    eq: NumberInput,
    neq: NumberInput,
    is_empty: null,
    is_not_empty: null,
    gt: NumberInput,
    gte: NumberInput,
    lt: NumberInput,
    lte: NumberInput,
  }

  const checkbox: Record<ICheckboxFieldConditionOp, ComponentType | null> = {
    is_true: null,
    is_false: null,
  }

  const email: Record<IEmailFieldConditionOp, ComponentType | null> = {
    eq: Input,
    neq: Input,
    contains: Input,
    does_not_contain: Input,
    starts_with: Input,
    ends_with: Input,
    is_empty: null,
    is_not_empty: null,
  }

  const autoIncrement: Record<IAutoIncrementFieldConditionOp, ComponentType | null> = {
    eq: NumberInput,
    neq: NumberInput,
    is_empty: null,
    is_not_empty: null,
    gt: NumberInput,
    gte: NumberInput,
    lt: NumberInput,
    lte: NumberInput,
  }

  const duration: Record<IDurationFieldConditionOp, ComponentType | null> = {
    eq: DurationInput,
    neq: DurationInput,
    gt: DurationInput,
    gte: DurationInput,
    lt: DurationInput,
    lte: DurationInput,
    is_empty: null,
    is_not_empty: null,
  }

  const id: Record<IIdFieldConditionOp, ComponentType | null> = {
    eq: IdFilterInput,
    neq: IdFilterInput,
    in: null,
    nin: null,
  }

  $: select = {
    eq: (field?.type === "select" && (field.isSingle ? OptionFilterInput : OptionsFilterInput)) || null,
    neq: (field?.type === "select" && (field.isSingle ? OptionFilterInput : OptionsFilterInput)) || null,
    any_of: OptionsFilterInput,
    not_any_of: OptionsFilterInput,
    is_empty: null,
    is_not_empty: null,
  } as Record<ISelectFieldConditionOp, ComponentType | null>

  const user: Record<IUserFieldConditionOp, ComponentType | null> = {
    eq: UserFilterInput,
    neq: UserFilterInput,
    is_empty: null,
    is_not_empty: null,
  }

  const createdBy: Record<ICreatedByFieldConditionOp, ComponentType | null> = {
    eq: UserFilterInput,
    neq: UserFilterInput,
    is_empty: null,
    is_not_empty: null,
  }

  const updatedBy: Record<IUpdatedByFieldConditionOp, ComponentType | null> = {
    eq: UserFilterInput,
    neq: UserFilterInput,
    is_empty: null,
    is_not_empty: null,
  }

  const json: Record<IJsonFieldConditionOp, ComponentType | null> = {
    eq: JsonDropdown,
    neq: JsonDropdown,
    contains: Input,
    does_not_contain: Input,
    is_empty: null,
    is_not_empty: null,
  }

  const url: Record<IUrlFieldConditionOp, ComponentType | null> = {
    eq: Input,
    neq: Input,
    contains: Input,
    does_not_contain: Input,
    starts_with: Input,
    ends_with: Input,
    is_empty: null,
    is_not_empty: null,
  }

  const longText: Record<ILongTextFieldConditionOp, ComponentType | null> = {
    contains: Input,
    does_not_contain: Input,
    is_empty: null,
    is_not_empty: null,
  }

  const percentage: Record<IPercentageFieldConditionOp, ComponentType | null> = {
    eq: NumberInput,
    neq: NumberInput,
    is_empty: null,
    is_not_empty: null,
  }

  $: formula = {}

  $: if (field?.type === "formula") {
    if (field.returnType === "number") {
      formula = {
        eq: NumberInput,
        neq: NumberInput,
        gt: NumberInput,
        gte: NumberInput,
        lt: NumberInput,
        lte: NumberInput,
        is_empty: null,
        is_not_empty: null,
      }
    } else if (field.returnType === "boolean") {
      formula = {
        is_true: null,
        is_false: null,
      }
    } else if (field.returnType === "string") {
      formula = {
        eq: Input,
        neq: Input,
        contains: Input,
        does_not_contain: Input,
        starts_with: Input,
        ends_with: Input,
        is_empty: null,
        is_not_empty: null,
      }
    }
  }

  $: filterFieldInput = {
    string,
    number,
    currency,
    date,
    id,
    createdAt,
    autoIncrement,
    updatedAt,
    createdBy,
    updatedBy,
    select,
    rating,
    email,
    checkbox,
    user,
    json,
    url,
    longText,
    duration,
    formula,
    percentage,
    dateRange,
  }

  $: component = filterFieldInput[field?.type]?.[op]
</script>

{#if field && op}
  {#if component}
    <svelte:component this={component} {disabled} bind:value class={className} {field} {onValueChange} />
  {/if}
{/if}
