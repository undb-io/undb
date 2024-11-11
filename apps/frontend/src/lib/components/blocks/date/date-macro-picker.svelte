<script lang="ts">
  import * as Select from "$lib/components/ui/select"
  import type { IDateFieldMacro } from "@undb/table"
  import { isString } from "radash"
  import { isDateFieldMacro } from "@undb/table"

  export let value: any | undefined = undefined
  export let onValueChange: (v: IDateFieldMacro | undefined) => void = () => {}

  $: selectedValue =
    isString(value) && isDateFieldMacro(value)
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
>
  <Select.Trigger>
    <Select.Value class="text-xs" placeholder="Select a macro..." />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="@now">Now</Select.Item>
  </Select.Content>
</Select.Root>
