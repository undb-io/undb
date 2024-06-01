<script lang="ts">
  import { invalidate } from "$app/navigation"
  import * as Select from "$lib/components/ui/select/index.js"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { cn } from "$lib/utils"
  import { createMutation } from "@tanstack/svelte-query"
  import type { AggregateResult, Field, IFieldAggregate, IViewAggregate } from "@undb/table"
  import type { Selected } from "bits-ui"
  import { derived } from "svelte/store"

  const table = getTable()
  export let field: Field

  export let aggregateResult: AggregateResult | undefined = undefined

  $: options = field.aggregate.options?.map((value) => ({ value, label: value })) ?? []
  $: value = $table.views.getViewById().aggregate.into(undefined)?.value?.[field.id.value]

  const setViewAggregateMutation = createMutation(
    derived([table], ([$table]) => ({
      mutationKey: ["table", $table.id.value, "setViewAggregate"],
      mutationFn: trpc.table.view.setAggregate.mutate,
      async onSuccess() {
        await invalidate(`table:${$table.id.value}`)
      },
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

  const onSelectedChange = (selected: Selected<IFieldAggregate> | undefined) => {
    if (selected?.value) {
      value = selected.value
      setViewAggregate(selected.value as IFieldAggregate)
    }
  }
</script>

{#if options.length}
  <Select.Root {onSelectedChange} selected={{ value: value, label: value }}>
    <Select.Trigger
      class={cn(
        "hover:bg-muted/50 h-full rounded-none border-none py-0 text-xs shadow-none hover:opacity-100 focus:ring-0",
        !aggregateResult && !value && "opacity-0",
      )}
    >
      <div class="flex items-center gap-2">
        <Select.Value />
        <span class="text-foreground">
          {#if aggregateResult !== undefined && aggregateResult !== null}
            {aggregateResult}
          {/if}
        </span>
      </div>
    </Select.Trigger>
    <Select.Content>
      <Select.Group>
        {#each options as option}
          <Select.Item value={option.value} label={option.label}>{option.label}</Select.Item>
        {/each}
      </Select.Group>
    </Select.Content>
    <Select.Input name="favoriteFruit" />
  </Select.Root>
{/if}
