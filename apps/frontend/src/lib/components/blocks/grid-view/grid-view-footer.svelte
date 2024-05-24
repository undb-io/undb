<script lang="ts">
  import * as Select from "$lib/components/ui/select/index.js"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import type { Field, IViewAggregate } from "@undb/table"
  import type { IFieldAggregate } from "@undb/table/src/modules/schema/fields/field.aggregate"
  import type { Selected } from "bits-ui"
  import { derived } from "svelte/store"

  const table = getTable()
  export let field: Field

  $: aggregate = field.aggregate.options?.map((value) => ({ value, label: value })) ?? []

  const setViewAggregateMutation = createMutation(
    derived([table], ([$table]) => ({
      mutationKey: ["setViewAggregate", $table.id.value],
      mutationFn: trpc.table.view.setAggregate.mutate,
    })),
  )

  const setViewAggregate = (value: IFieldAggregate) => {
    const aggregate = $table.views.getViewById().aggregate.into(undefined)?.value
    const newAggregate: IViewAggregate = { ...aggregate, [field.id.value]: value }

    $setViewAggregateMutation.mutate({
      tableId: $table.id.value,
      viewId: $table.views.getViewById().id.value,
      aggregate: newAggregate,
    })
  }

  const onSelectedChange = (selected: Selected<undefined> | undefined) => {
    if (selected?.value) {
      setViewAggregate(selected.value as IFieldAggregate)
    }
  }
</script>

{#if aggregate.length}
  <Select.Root {onSelectedChange}>
    <Select.Trigger class="hover:bg-muted/50 h-7 rounded-none border-none py-0 text-xs focus:ring-0">
      <Select.Value />
    </Select.Trigger>
    <Select.Content>
      <Select.Group>
        {#each aggregate as aggregate}
          <Select.Item value={aggregate.value} label={aggregate.label}>{aggregate.label}</Select.Item>
        {/each}
      </Select.Group>
    </Select.Content>
    <Select.Input name="favoriteFruit" />
  </Select.Root>
{/if}
