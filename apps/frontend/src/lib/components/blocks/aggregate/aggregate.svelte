<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { cn } from "$lib/utils"
  import { createQuery } from "@tanstack/svelte-query"
  import { ID_TYPE, type IAggregate } from "@undb/table"
  import { derived } from "svelte/store"

  const table = getTable()
  export let viewId: string | undefined

  export let aggregate: IAggregate

  const getAggregate = createQuery({
    queryKey: ["aggregate", $table.id.value],
    queryFn: () => {
      if (aggregate.type === "count") {
        return trpc.record.aggregate.query({
          tableId: $table.id.value,
          viewId,
          aggregate: { [ID_TYPE]: "count" },
          condition: aggregate.condition,
        })
      }

      if (aggregate.config.field) {
        return trpc.record.aggregate.query({
          tableId: $table.id.value,
          viewId,
          aggregate: { [aggregate.config.field]: aggregate.type },
          condition: aggregate.condition,
        })
      }
    },
  })

  let count = derived(
    getAggregate,
    ($data) => ($data.data as any)?.[aggregate.type === "count" ? ID_TYPE : aggregate.config.field!],
  )
  $: isPending = $getAggregate.isPending
</script>

<div class={cn("flex h-full w-full items-center justify-center rounded-lg bg-white p-6", $$restProps.class)}>
  {#if isPending}
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
  {:else}
    <span class="text-8xl font-bold">{$count}</span>
  {/if}
</div>
