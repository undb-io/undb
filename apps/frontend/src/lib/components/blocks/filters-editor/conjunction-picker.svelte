<script lang="ts">
  import * as Select from "$lib/components/ui/select/index.js"
  import type { Selected } from "bits-ui"

  export let value: string | undefined

  $: selected = { value, label: value }

  const fruits = [
    { value: "and", label: "and" },
    { value: "or", label: "or" },
  ]

  function onSelected(selected?: Selected<string | undefined>) {
    value = selected?.value
  }
</script>

<Select.Root onSelectedChange={onSelected} {selected}>
  <Select.Trigger {...$$restProps}>
    <Select.Value placeholder="op..." />
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      {#each fruits as fruit}
        <Select.Item value={fruit.value} label={fruit.label}>{fruit.label}</Select.Item>
      {/each}
    </Select.Group>
  </Select.Content>
  <Select.Input name="favoriteFruit" />
</Select.Root>
