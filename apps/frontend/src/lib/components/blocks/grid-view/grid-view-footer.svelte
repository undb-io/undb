<script lang="ts">
  import { invalidate } from "$app/navigation"
  import * as Select from "$lib/components/ui/select/index.js"
  import { aggregatesStore } from "$lib/store/aggregates.store"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { cn } from "$lib/utils"
  import { createMutation } from "@tanstack/svelte-query"
  import { LL } from "@undb/i18n/client"
  import type { AggregateResult, Field, IFieldAggregate, IViewAggregate } from "@undb/table"
  import type { Selected } from "bits-ui"
  import { derived } from "svelte/store"
  import { useQueryClient } from "@tanstack/svelte-query"
  import type { Readable } from "svelte/store"

  const table = getTable()
  export let viewId: Readable<string | undefined>
  export let field: Field
  export let readonly: boolean

  let aggregates = derived(
    [aggregatesStore, table, viewId],
    ([$aggregates, $table, $viewId]) => $aggregates[$viewId ?? $table.views.getDefaultView()?.id.value],
  )

  $: aggregateResult = field.formatAggregate(value, $aggregates?.[field.id.value] ?? undefined)

  $: options =
    // @ts-ignore
    field.aggregate.options?.map((value) => ({ value, label: $LL.table.aggregateFns[value as IFieldAggregate]() })) ??
    []
  $: value = $table.views.getViewById($viewId).aggregate.into(undefined)?.value?.[field.id.value]

  const client = useQueryClient()
  const setViewAggregateMutation = createMutation(
    derived([table], ([$table]) => ({
      mutationKey: ["table", $table.id.value, "setViewAggregate"],
      mutationFn: trpc.table.view.setAggregate.mutate,
      async onSuccess() {
        await invalidate(`undb:table:${$table.id.value}`)
        await client.invalidateQueries({ queryKey: ["aggregates", $table.id.value] })
      },
    })),
  )

  const setViewAggregate = (value: IFieldAggregate) => {
    const aggregate = $table.views.getViewById($viewId).aggregate.into(undefined)?.value
    const newAggregate: IViewAggregate = { ...aggregate, [field.id.value]: value }

    $setViewAggregateMutation.mutate({
      tableId: $table.id.value,
      viewId: $viewId,
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
  <Select.Root
    disabled={readonly}
    {onSelectedChange}
    selected={{ value: value, label: $LL.table.aggregateFns[value]() }}
  >
    <Select.Trigger
      class={cn(
        "hover:bg-muted/50 h-full rounded-none border-none py-0 text-xs shadow-none hover:opacity-100 focus:ring-0",
        !aggregateResult && !value && "opacity-0",
      )}
    >
      <div class="flex items-center gap-2">
        <Select.Value class="text-muted-foreground text-xs" />
        <span class="text-foreground font-semibold">
          {#if aggregateResult !== undefined && aggregateResult !== null}
            {aggregateResult}
          {/if}
        </span>
      </div>
    </Select.Trigger>
    <Select.Content>
      <Select.Group>
        {#each options as option}
          <Select.Item class="text-xs" value={option.value} label={option.label}>{option.label}</Select.Item>
        {/each}
      </Select.Group>
    </Select.Content>
    <Select.Input name="favoriteFruit" />
  </Select.Root>
{/if}
