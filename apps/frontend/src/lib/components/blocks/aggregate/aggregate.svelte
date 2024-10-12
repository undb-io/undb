<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { cn } from "$lib/utils"
  import { createQuery } from "@tanstack/svelte-query"
  import { ID_TYPE, isValidWidget, type IAggregate, type IWidgetDTO } from "@undb/table"
  import { isNumber } from "radash"
  import { derived } from "svelte/store"
  import { TriangleAlertIcon } from "lucide-svelte"
  import * as Tooltip from "$lib/components/ui/tooltip"

  const table = getTable()
  export let viewId: string | undefined
  export let shareId: string | undefined

  export let widget: IWidgetDTO
  export let aggregate: IAggregate

  $: isValid = isValidWidget(widget)

  const getAggregate = createQuery({
    queryKey: ["aggregate", $table.id.value, widget.id],
    queryFn: () => {
      const agg =
        aggregate.type === "count"
          ? ({ [ID_TYPE]: "count" } as const)
          : ({ [aggregate.config.field!]: aggregate.type } as const)
      if (shareId) {
        return trpc.shareData.aggregate.query({
          shareId,
          tableId: $table.id.value,
          viewId,
          aggregate: agg,
          condition: aggregate.condition,
        })
      }
      return trpc.record.aggregate.query({
        tableId: $table.id.value,
        viewId,
        aggregate: agg,
        condition: aggregate.condition,
      })
    },
  })

  let count = derived(
    getAggregate,
    ($data) => ($data.data as any)?.[aggregate.type === "count" ? ID_TYPE : aggregate.config.field!],
  )
  $: isPending = $getAggregate.isPending
</script>

<div class={cn("flex h-full w-full items-center justify-center rounded-lg bg-white p-6", $$restProps.class)}>
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
  {:else if isNumber($count)}
    {#if $count > 10000}
      <span class="text-6xl font-bold">{$count}</span>
    {:else}
      <span class="text-8xl font-bold">{$count}</span>
    {/if}
  {/if}
</div>
