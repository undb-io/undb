<script lang="ts">
  import * as Tabs from "$lib/components/ui/tabs"
  import { getTable } from "$lib/store/table.store"
  import {
    getIsFilterableFieldType,
    parseValidAggregateCondition,
    toMaybeConditionGroup,
    type IAggregate,
    type IAggregateCondition,
    type IWidgetDTO,
    type MaybeConditionGroup,
  } from "@undb/table"
  import { writable } from "svelte/store"
  import FiltersEditor from "../../filters-editor/filters-editor.svelte"
  import { createMutation } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { Button } from "$lib/components/ui/button"
  import { SaveIcon } from "lucide-svelte"

  export let viewId: string
  export let widget: IWidgetDTO
  export let aggregate: IAggregate
  export let onSuccess: () => void = () => {}

  const table = getTable()
  const value = writable<MaybeConditionGroup<IAggregateCondition> | undefined>(
    toMaybeConditionGroup(aggregate.condition),
  )
  $: validValue = $value ? parseValidAggregateCondition($table.schema, $value) : undefined
  $: visibleFields = $table.getOrderedVisibleFields()

  const updateViewWidgetMutation = createMutation({
    mutationFn: trpc.table.view.widget.update.mutate,
    onSuccess(data, variables, context) {
      onSuccess()
    },
  })

  const updateViewWidget = () => {
    $updateViewWidgetMutation.mutate({
      tableId: $table.id.value,
      viewId,
      widget: {
        ...widget,
        item: {
          type: "aggregate",
          aggregate: {
            ...aggregate,
            condition: validValue,
          },
        },
      },
    })
  }
</script>

<div class="flex h-full flex-col py-2">
  <div class="flex-1 space-y-3">
    <div class="flex gap-2">
      <div class="h-ful w-1 rounded-sm bg-gray-200"></div>
      <div class="text-sm font-medium">Settings</div>
    </div>
    <Tabs.Root value="count" class="w-full">
      <Tabs.List class="w-full">
        <Tabs.Trigger class="flex-1" value="count">Count</Tabs.Trigger>
        <Tabs.Trigger class="flex-1" value="aggregate">Aggregate</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="count">Make changes to your account here.</Tabs.Content>
      <Tabs.Content value="aggregate">Change your password here.</Tabs.Content>
    </Tabs.Root>

    <div class="flex gap-2">
      <div class="h-ful w-1 rounded-sm bg-gray-200"></div>
      <div class="text-sm font-medium">Filters</div>
    </div>

    <FiltersEditor
      bind:value={$value}
      table={$table}
      filter={(field) => visibleFields.some((f) => f.id.value === field.id) && getIsFilterableFieldType(field.type)}
    ></FiltersEditor>
  </div>

  <div class="flex justify-end">
    <Button disabled={$updateViewWidgetMutation.isPending} on:click={updateViewWidget} class="w-full">
      <SaveIcon class="mr-2 size-4" />
      Save
    </Button>
  </div>
</div>
