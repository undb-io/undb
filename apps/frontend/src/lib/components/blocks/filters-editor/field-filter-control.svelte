<script lang="ts">
  import { type Field, type IOpType } from "@undb/table"
  import { LL } from "@undb/i18n/client"
  import OpPicker from "./op-picker.svelte"
  import { cn } from "$lib/utils"
  import FilterInput from "./filter-input.svelte"
  import FieldFilterOption from "./field-filter-option.svelte"

  export let field: Field | undefined
  export let op: IOpType | undefined
  export let option: any
  export let value: any | undefined = undefined
  export let disabled = false

  export let onOptionChange: ((option: any) => void) | undefined = undefined
  export let onValueChange: ((value: any) => void) | undefined = undefined
  export let onOpChange: ((op: IOpType) => void) | undefined = undefined

  $: conditionOps = field?.conditionOps ?? []
  $: ops = conditionOps.map((op) => ({ value: op, label: $LL.table.ops[op]() })) ?? []

  $: if (field && !!op && !conditionOps.includes(op)) {
    op = ops[0]?.value
  }

  $: hasValue = op ? (field?.isOpHasValue(op) ?? false) : false
</script>

<div class={cn("col-span-8 flex flex-1 items-center gap-0", $$restProps.class)}>
  <FieldFilterOption {field} bind:option class="h-8 w-20 font-semibold" />
  <OpPicker
    {disabled}
    {field}
    bind:value={op}
    class={cn("rounded-l-none", hasValue && "rounded-r-none")}
    onValueChange={onOpChange}
  />
  {#if hasValue}
    <FilterInput {disabled} class="flex-1" {field} bind:value {op} {onValueChange} />
  {/if}
</div>
