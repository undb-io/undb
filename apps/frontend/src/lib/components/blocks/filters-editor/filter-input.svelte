<script lang="ts">
  import type {
    Field,
    IAutoIncrementFieldConditionOp,
    ICheckboxFieldConditionOp,
    ICreatedAtFieldConditionOp,
    ICreatedByFieldConditionOp,
    IDateFieldConditionOp,
    IEmailFieldConditionOp,
    IFilterableFieldType,
    IIdFieldConditionOp,
    IJsonFieldConditionOp,
    INumberFieldConditionOp,
    IOpType,
    IRatingFieldConditionOp,
    ISelectFieldConditionOp,
    IStringFieldConditionOp,
    IUpdatedAtFieldConditionOp,
    IUpdatedByFieldConditionOp,
    IUserFieldConditionOp,
  } from "@undb/table"
  import Input from "$lib/components/ui/input/input.svelte"
  import { cn } from "$lib/utils"
  import type { ComponentType } from "svelte"
  import NumberInput from "$lib/components/ui/input/number-input.svelte"
  import DateControl from "$lib/components/blocks/field-control/date-control.svelte"
  import OptionPicker from "$lib/components/blocks/option/option-picker.svelte"
  import UserPicker from "../user/user-picker.svelte"
  import JsonDropdown from "../json/json-dropdown.svelte"

  export let field: Field | undefined
  export let recordId: string | undefined = undefined
  export let value: any | undefined = undefined
  export let displayValue: any | undefined = undefined
  export let op: IOpType | undefined = undefined

  const className = cn("h-8 rounded-l-none border-l-0 py-0 text-xs bg-background", $$restProps.class)

  const string: Record<IStringFieldConditionOp, ComponentType | null> = {
    eq: Input,
    neq: Input,
    contains: Input,
    does_not_contain: Input,
    starts_with: Input,
    ends_with: Input,
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
  }

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

  const id: Record<IIdFieldConditionOp, ComponentType | null> = {
    eq: Input,
    neq: Input,
    in: null,
    nin: null,
  }

  const select: Record<ISelectFieldConditionOp, ComponentType | null> = {
    eq: OptionPicker,
    neq: OptionPicker,
    is_empty: null,
    is_not_empty: null,
  }

  const user: Record<IUserFieldConditionOp, ComponentType | null> = {
    eq: UserPicker,
    neq: UserPicker,
    is_empty: null,
    is_not_empty: null,
  }

  const createdBy: Record<ICreatedByFieldConditionOp, ComponentType | null> = {
    eq: UserPicker,
    neq: UserPicker,
    is_empty: null,
    is_not_empty: null,
  }

  const updatedBy: Record<IUpdatedByFieldConditionOp, ComponentType | null> = {
    eq: UserPicker,
    neq: UserPicker,
    is_empty: null,
    is_not_empty: null,
  }

  const json: Record<IJsonFieldConditionOp, ComponentType | null> = {
    eq: JsonDropdown,
    neq: JsonDropdown,
    is_empty: null,
    is_not_empty: null,
  }

  const filterFieldInput: Record<IFilterableFieldType, Record<any, ComponentType | null>> = {
    string,
    number,
    date,
    id,
    createdAt,
    autoIncrement,
    updatedAt,
    createdBy,
    updatedBy,
    select: select,
    rating,
    email,
    checkbox,
    user,
    json,
  }
</script>

{#if field && op}
  {@const c = filterFieldInput[field.type]?.[op]}
  {#if c}
    <svelte:component this={c} bind:value class={className} {field} />
  {/if}
{/if}
