<script lang="ts">
  import * as Select from "$lib/components/ui/select"
  import { formatItems } from "@undb/table"
  import { isString } from "radash"

  export let value: string | undefined = formatItems[0]
  export let onValueChange: (v: string | undefined) => void = () => {}

  const dateFormats = formatItems.map((v) => ({
    label: v,
    value: v,
  }))

  $: selectedValue = isString(value)
    ? {
        label: value,
        value,
      }
    : undefined
</script>

<Select.Root
  selected={selectedValue}
  onSelectedChange={(v) => {
    if (v) {
      value = v.value
    } else {
      value = undefined
    }
    onValueChange(v?.value)
  }}
  {...$$restProps}
>
  <Select.Trigger>
    <Select.Value class="text-xs" placeholder="Select a date format..." />
  </Select.Trigger>
  <Select.Content>
    {#each dateFormats as format}
      <Select.Item class="text-xs text-gray-600" value={format.value}>
        {format.label}
      </Select.Item>
    {/each}
  </Select.Content>
</Select.Root>
