<script lang="ts">
  import * as Select from "$lib/components/ui/select"
  import type { IDateFieldMacro } from "@undb/table"
  import { isString } from "radash"
  import { dateFieldMacros, isDateFieldMacro } from "@undb/table"
  import { LL } from "@undb/i18n/client"

  export let value: any | undefined = undefined
  export let onValueChange: (v: IDateFieldMacro | undefined) => void = () => {}

  $: selectedValue =
    isString(value) && isDateFieldMacro(value)
      ? {
          label: value,
          value,
        }
      : undefined

  const macros = dateFieldMacros.map((v) => ({
    label: $LL.table.macros[v](),
    value: v,
  }))
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
    <Select.Value class="text-xs" placeholder={$LL.table.field.date.selectMacro()} />
  </Select.Trigger>
  <Select.Content>
    {#each macros as macro}
      <Select.Item class="text-xs text-gray-600" value={macro.value}>
        {macro.label}
      </Select.Item>
    {/each}
  </Select.Content>
</Select.Root>
