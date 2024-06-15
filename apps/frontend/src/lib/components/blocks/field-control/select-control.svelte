<script lang="ts">
  import * as Select from "$lib/components/ui/select"

  import type { SelectField } from "@undb/table"
  import Option from "../option/option.svelte"

  export let field: SelectField
  export let value: string

  $: selected = field.options.find((option) => option.id === value)
  $: selectedOption = selected ? { value: selected.id, label: selected.name } : undefined
</script>

<Select.Root
  selected={selectedOption}
  onSelectedChange={(s) => {
    if (s) {
      value = s.value
    }
  }}
>
  <Select.Trigger class="w-full">
    {#if selected}
      <Option option={selected} />
    {:else}
      <span>select a option</span>
    {/if}
  </Select.Trigger>
  <Select.Content>
    {#each field.options as option}
      <Select.Item value={option.id}>
        <Option {option} />
      </Select.Item>
    {/each}
  </Select.Content>
</Select.Root>
