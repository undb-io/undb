<script lang="ts">
  import * as Select from "$lib/components/ui/select"
  import { PIVOT_AGGREGATE, type IPivotAggregate } from "@undb/table"
  import { LL } from "@undb/i18n/client"

  export let value: IPivotAggregate | undefined
  export let onValueChange: (v: IPivotAggregate | undefined) => void = () => {}

  $: selectedValue = value ? { label: value, value } : undefined
</script>

<Select.Root
  selected={selectedValue}
  onSelectedChange={(v) => {
    value = v?.value
    onValueChange(v?.value)
  }}
>
  <Select.Trigger>
    <Select.Value placeholder={$LL.table.view.pivot.selectField()} class={$$restProps.class}>
      {$LL.table.view.pivot.aggregateFn[selectedValue?.label ?? "sum"]()}
    </Select.Value>
  </Select.Trigger>
  <Select.Content>
    {#each PIVOT_AGGREGATE as aggregate}
      <Select.Item value={aggregate}>{$LL.table.view.pivot.aggregateFn[aggregate]()}</Select.Item>
    {/each}
  </Select.Content>
</Select.Root>
