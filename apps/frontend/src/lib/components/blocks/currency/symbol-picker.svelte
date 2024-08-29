<script lang="ts">
  import * as Select from "$lib/components/ui/select/index.js"
  import type { ISymbol } from "@undb/table"
  import type { Selected } from "bits-ui"

  export let value: ISymbol | undefined = "$"

  $: selected = { value, label: value }

  const symbols = [
    { value: "$", label: "$" },
    { value: "￥", label: "￥" },
    { value: "€", label: "€" },
    { value: "￡", label: "￡" },
  ]

  function onSelected(selected?: Selected<ISymbol | undefined>) {
    value = selected?.value
  }
</script>

<Select.Root onSelectedChange={onSelected} {selected}>
  <Select.Trigger {...$$restProps}>
    <Select.Value placeholder="op..." />
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      {#each symbols as fruit}
        <Select.Item value={fruit.value} label={fruit.label}>{fruit.label}</Select.Item>
      {/each}
    </Select.Group>
  </Select.Content>
  <Select.Input name="favoriteFruit" />
</Select.Root>
