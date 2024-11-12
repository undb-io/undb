<script lang="ts">
  import * as Select from "$lib/components/ui/select"
  import { PIVOT_AGGREGATE, type IPivotAggregate } from "@undb/table"

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
    <Select.Value placeholder="Select a aggregate..." class={$$restProps.class} />
  </Select.Trigger>
  <Select.Content>
    {#each PIVOT_AGGREGATE as aggregate}
      <Select.Item value={aggregate}>{aggregate}</Select.Item>
    {/each}
  </Select.Content>
</Select.Root>
