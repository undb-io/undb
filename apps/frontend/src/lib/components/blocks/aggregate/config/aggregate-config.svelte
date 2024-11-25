<script lang="ts">
  import * as Tabs from "$lib/components/ui/tabs"
  import { invalidate } from "$app/navigation"
  import {
    filterAggregateField,
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
  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { Button } from "$lib/components/ui/button"
  import { SaveIcon } from "lucide-svelte"
  import FieldPicker from "../../field-picker/field-picker.svelte"
  import AggregateTypePicker from "../aggregate-type-picker.svelte"
  import { tick } from "svelte"
  import { toast } from "svelte-sonner"
  import { getDashboard, getIsDashboard } from "$lib/store/dashboard.store"
  import type { TableDo } from "@undb/table"
  import { LL } from "@undb/i18n/client"

  export let table: TableDo | undefined
  export let viewId: string | undefined
  export let tableId: string | undefined
  export let widget: IWidgetDTO
  export let aggregate: IAggregate
  export let onSuccess: () => void = () => {}

  const isDashboard = getIsDashboard()
  const dashboard = getDashboard()

  const value = writable<MaybeConditionGroup<IAggregateCondition> | undefined>(
    toMaybeConditionGroup(aggregate.condition),
  )
  $: validValue = $value && table ? parseValidAggregateCondition(table.schema, $value) : undefined
  $: visibleFields = table?.getOrderedVisibleFields() ?? []

  const client = useQueryClient()

  const updateWidgetMutation = createMutation({
    mutationFn: trpc.table.view.widget.update.mutate,
    async onSuccess(data, variables, context) {
      if (table) {
        await invalidate(`undb:table:${table.id.value}`)
        await tick()
        await client.invalidateQueries({ queryKey: ["aggregate", table.id.value, widget.id] })
      }
      if (isDashboard) {
        await invalidate(`undb:dashboard:${$dashboard.id.value}`)
        await tick()
      }
      onSuccess()
    },
    onError(error, variables, context) {
      toast.error(error.message)
    },
  })

  const updateDashboardWidget = createMutation({
    mutationFn: trpc.dashboard.widget.update.mutate,
    async onSuccess(data, variables, context) {
      if (table) {
        await invalidate(`undb:dashboard:${$dashboard.id.value}`)
        await tick()
        await client.invalidateQueries({ queryKey: ["aggregate", table.id.value, widget.id] })
      }
      onSuccess()
    },
  })

  const updateViewWidget = (widget: IWidgetDTO) => {
    if (widget.item.type !== "aggregate") {
      return
    }

    if ($isDashboard) {
      $updateDashboardWidget.mutate({
        id: $dashboard.id.value,
        widget: {
          table: {
            id: tableId,
          },
          widget: {
            ...widget,
            item: {
              type: "aggregate",
              aggregate: {
                ...widget.item.aggregate,
                condition: validValue,
              },
            },
          },
        },
      })
    } else {
      if (!viewId || !table) {
        return
      }
      $updateWidgetMutation.mutate({
        tableId: table.id.value,
        viewId,
        widget: {
          ...widget,
          item: {
            type: "aggregate",
            aggregate: {
              ...widget.item.aggregate,
              condition: validValue,
            },
          },
        },
      })
    }
  }
</script>

{#if widget.item.type === "aggregate"}
  <div class="flex h-full flex-col py-2">
    <div class="flex-1 space-y-3">
      <div class="flex gap-2">
        <div class="h-ful w-1 rounded-sm bg-gray-200"></div>
        <div class="text-sm font-medium">{$LL.common.settings()}</div>
      </div>
      <Tabs.Root
        class="w-full"
        value={widget.item.aggregate.type === "count" ? "count" : "aggregate"}
        onValueChange={(value) => {
          if (widget.item.type === "aggregate") {
            if (value === "aggregate") {
              widget.item.aggregate.type = "sum"
              // @ts-expect-error for type infer
              if (widget.item.aggregate.type !== "count") {
                widget.item.aggregate.config = { field: undefined }
              }
            }
            if (value === "count") {
              widget.item.aggregate = {
                type: "count",
              }
            }
          }
        }}
      >
        <Tabs.List class="w-full">
          <Tabs.Trigger class="flex-1" value="count">{$LL.widget.count()}</Tabs.Trigger>
          <Tabs.Trigger class="flex-1" value="aggregate">{$LL.widget.aggregate()}</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="count"></Tabs.Content>
        <Tabs.Content value="aggregate" class="space-y-2">
          {#if widget.item.type === "aggregate" && widget.item.aggregate.type !== "count"}
            <AggregateTypePicker
              bind:value={widget.item.aggregate.type}
              onValueChange={() => (widget.item.aggregate.config.field = undefined)}
            />
            {#if table}
              <FieldPicker
                table={writable(table)}
                bind:value={widget.item.aggregate.config.field}
                class="w-full flex-1"
                placeholder={$LL.aggregate.selectField()}
                filter={(field) => filterAggregateField(field.type, widget.item.aggregate?.type)}
              />
            {/if}
          {/if}
        </Tabs.Content>
      </Tabs.Root>

      <div class="flex gap-2">
        <div class="h-ful w-1 rounded-sm bg-gray-200"></div>
        <div class="text-sm font-medium">{$LL.widget.filters()}</div>
      </div>

      {#if table}
        <FiltersEditor
          bind:value={$value}
          {table}
          filter={(field) =>
            visibleFields?.some((f) => f.id.value === field.id) && getIsFilterableFieldType(field.type)}
          class="rounded-md border"
        ></FiltersEditor>
      {/if}
    </div>

    <div class="flex justify-end">
      <Button disabled={$updateWidgetMutation.isPending} on:click={() => updateViewWidget(widget)} class="w-full">
        <SaveIcon class="mr-2 size-4" />
        {$LL.common.save()}
      </Button>
    </div>
  </div>
{/if}
