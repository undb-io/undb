<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet"
  import Button from "$lib/components/ui/button/button.svelte"
  import RecordDetail from "./record-detail.svelte"
  import { queryParam, ssp } from "sveltekit-search-params"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createQuery } from "@tanstack/svelte-query"
  import { RecordDO } from "@undb/table"
  import { derived } from "svelte/store"
  import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte"

  const r = queryParam("r", ssp.string(), { pushHistory: false })

  const table = getTable()

  const record = createQuery(
    derived([table, r], ([$table, $recordId]) => ({
      queryKey: [$recordId, "get"],
      queryFn: () =>
        trpc.record.get.query({
          tableId: $table?.id.value,
          id: $recordId!,
        }),
      enabled: !!$recordId,
    })),
  )

  $: recordDo = $record.data?.record ? RecordDO.fromJSON($table, $record.data?.record) : undefined

  let disabled = false
  let dirty = false
</script>

<Sheet.Root
  open={!!$r}
  onOpenChange={(open) => {
    if (!open) {
      r.set("")
    }
  }}
>
  <Sheet.Content class="sm:max-w-1/2 flex w-1/2 flex-col" transitionConfig={{ duration: 50 }}>
    <Sheet.Header>
      <Sheet.Title>Record Detail</Sheet.Title>
    </Sheet.Header>

    <div class="flex-1">
      {#if $record.isLoading}
        <div class="space-y-4">
          <Skeleton class="h-10 w-full" />
          <Skeleton class="h-10 w-full" />
          <Skeleton class="h-10 w-full" />
          <Skeleton class="h-10 w-full" />
          <Skeleton class="h-10 w-full" />
        </div>
      {/if}
      {#if recordDo}
        <RecordDetail record={recordDo} />
      {/if}
    </div>

    <Sheet.Footer>
      <Button variant="outline" type="button" on:click={() => ($r = "")}>Cancel</Button>
      <Button type="submit" form="createRecord" {disabled}>Create</Button>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>
