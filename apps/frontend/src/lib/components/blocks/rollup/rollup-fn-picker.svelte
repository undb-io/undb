<script lang="ts">
  import { FieldIdVo, getRollupFnByType, type IRollupFn, type TableDo } from "@undb/table"
  import * as Select from "$lib/components/ui/select/index.js"
  import { LL } from "@undb/i18n/client"

  export let foreignTable: TableDo
  export let rollupFieldId: string
  export let disabled: boolean = false

  $: rollupField = rollupFieldId
    ? foreignTable.schema.getFieldById(new FieldIdVo(rollupFieldId)).into(undefined)
    : undefined

  $: fns = rollupField ? getRollupFnByType(rollupField.type) : undefined
  $: fns, (value = fns?.includes(value as any) ? value : fns?.[0])

  $: fnOptions = fns?.map((fn) => ({ value: fn, label: $LL.table.rollupFns[fn]() }))

  export let value: IRollupFn | undefined = undefined

  $: selected = value ? { value: value, label: $LL.table.rollupFns[value]() } : undefined
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
    <Select.Trigger {disabled} class="w-full">
      <Select.Value class="text-xs" placeholder="Select a rollup function..." />
    </Select.Trigger>
    <Select.Content sameWidth>
      <Select.Group>
        {#each fnOptions as option}
          <Select.Item class="text-xs" value={option.value} label={option.label}>
            {option.label}
          </Select.Item>
        {/each}
      </Select.Group>
    </Select.Content>
    <Select.Input name="favoriteFruit" />
  </Select.Root>
{/if}
