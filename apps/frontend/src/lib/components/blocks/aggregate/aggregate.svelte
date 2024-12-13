<script lang="ts">
  import { trpc } from "$lib/trpc/client"
  import { cn } from "$lib/utils"
  import { createQuery } from "@tanstack/svelte-query"
  import { ID_TYPE, isValidWidget, type IAggregate, type IWidgetDTO } from "@undb/table"
  import { derived } from "svelte/store"
  import { TriangleAlertIcon } from "lucide-svelte"
  import * as Tooltip from "$lib/components/ui/tooltip"
  import type { TableDo } from "@undb/table"
  import { getDataService } from "$lib/store/data-service.store"

  export let tableId: string | undefined
  export let table: TableDo | undefined
  export let viewId: string | undefined
  export let shareId: string | undefined
  export let ignoreView: boolean = false
  export let readonly = false

  export let widget: IWidgetDTO
  export let aggregate: IAggregate

  $: isValid = isValidWidget(widget) && !!tableId

  const dataService = getDataService()

  const getAggregate = createQuery({
    queryKey: ["aggregate", widget.id],
    enabled: !!tableId,
    queryFn: async () => {
      const agg =
        aggregate.type === "count"
          ? ({ [ID_TYPE]: "count" } as const)
          : ({ [aggregate.config.field!]: aggregate.type } as const)
      if (shareId) {
        return trpc.shareData.aggregate.query({
          shareId,
          tableId: tableId!,
          viewId,
          aggregate: agg,
          condition: aggregate.condition,
          ignoreView,
        })
      }
      return dataService.records.getAggregates({
        tableId: tableId!,
        viewId,
        aggregate: agg,
        condition: aggregate.condition,
        ignoreView,
      })
    },
  })

  let value = derived([getAggregate], ([$data]) => {
    if (aggregate.type === "count") {
      return ($data.data as any)?.[ID_TYPE]
    }
    if (aggregate.config.field && table) {
      const field = table.schema.getFieldByIdOrName(aggregate.config.field)
      if (field.isSome()) {
        return field.unwrap().formatAggregate(aggregate.type, ($data.data as any)?.[aggregate.config.field])
      }
    }
    return undefined
  })
  $: isPending = $getAggregate.isPending
</script>

<div class={cn("flex w-full flex-1 items-center justify-center rounded-lg px-6 text-[3rem]", $$restProps.class)}>
  {#if !isValid}
    <Tooltip.Root>
      <Tooltip.Trigger>
        <TriangleAlertIcon class="text-orange-300" />
      </Tooltip.Trigger>
      <Tooltip.Content>
        <p>The widget config is invalid</p>
      </Tooltip.Content>
    </Tooltip.Root>
  {:else if isPending}
    <div class="flex animate-pulse space-x-4">
      <div class="h-16 w-16 rounded-full bg-slate-200"></div>
      <div class="flex-1 space-y-6 py-1">
        <div class="h-4 rounded bg-slate-200"></div>
        <div class="space-y-3">
          <div class="grid grid-cols-3 gap-4">
            <div class="col-span-2 h-4 rounded bg-slate-200"></div>
            <div class="col-span-1 h-4 rounded bg-slate-200"></div>
          </div>
        </div>
      </div>
    </div>
  {:else if $value !== undefined}
    <span class="font-bold">{$value}</span>
  {/if}
</div>
