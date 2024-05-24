<script lang="ts">
  import * as Select from "$lib/components/ui/select/index.js"
  import { getTable } from "$lib/store/table.store"
  import type { Field } from "@undb/table"

  const table = getTable()
  export let field: Field

  $: aggregates = field.aggregates.options?.map((value) => ({ value, label: value })) ?? []
</script>

{#if aggregates.length}
  <Select.Root>
    <Select.Trigger class="hover:bg-muted/50 h-7 rounded-none border-none py-0 text-xs focus:ring-0">
      <Select.Value />
    </Select.Trigger>
    <Select.Content>
      <Select.Group>
        {#each aggregates as aggregate}
          <Select.Item value={aggregate.value} label={aggregate.label}>{aggregate.label}</Select.Item>
        {/each}
      </Select.Group>
    </Select.Content>
    <Select.Input name="favoriteFruit" />
  </Select.Root>
{/if}
