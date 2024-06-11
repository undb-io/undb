<script lang="ts">
  import { FieldIdVo, getRollupFnByType, type IRollupFn, type TableDo } from "@undb/table"
  import * as Select from "$lib/components/ui/select/index.js"

  export let foreignTable: TableDo
  export let rollupFieldId: string

  $: rollupField = rollupFieldId
    ? foreignTable.schema.getFieldById(new FieldIdVo(rollupFieldId)).into(undefined)
    : undefined

  $: fns = rollupField ? getRollupFnByType(rollupField.type) : undefined

  $: fnOptions = fns?.map((fn) => ({ value: fn, label: fn }))

  export let value: IRollupFn | undefined = undefined

  $: selected = value ? { value: value, label: value } : undefined
</script>

{#if fnOptions?.length}
  <Select.Root
    {selected}
    onSelectedChange={(v) => {
      if (v) {
        value = v.value
      }
    }}
  >
    <Select.Trigger class="w-full">
      <Select.Value placeholder="Select a fn" />
    </Select.Trigger>
    <Select.Content>
      <Select.Group>
        {#each fnOptions as option}
          <Select.Item value={option.value} label={option.label}>
            {option.label}
          </Select.Item>
        {/each}
      </Select.Group>
    </Select.Content>
    <Select.Input name="favoriteFruit" />
  </Select.Root>
{/if}
