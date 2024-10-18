<script lang="ts">
  import type { IViewFilterGroup } from "@undb/table"
  import GridView from "$lib/components/blocks/grid-view/grid-view.svelte"
  import { getTable } from "$lib/store/table.store"
  import * as Dialog from "$lib/components/ui/dialog"
  import { Button } from "$lib/components/ui/button"
  import { FullscreenIcon } from "lucide-svelte"
  import { r } from "$lib/store/records.store"
  import type { Readable } from "svelte/store"

  const table = getTable()
  export let viewId: Readable<string | undefined>

  export let filter: IViewFilterGroup

  // const countRecords = createQuery({
  //   queryKey: ["table", $table.id.value, "countRecords", JSON.stringify(filter)],
  //   queryFn: () =>
  //     trpc.record.count.query({
  //       tableId: $table.id.value,
  //       filters: filter,
  //     }),
  //   enabled: !!filter,
  // })

  // $: count = $countRecords.data?.count
</script>

<Dialog.Root>
  <Dialog.Trigger disabled={!filter} asChild let:builder>
    <Button size="sm" variant="outline" builders={[builder]}>
      <FullscreenIcon class="mr-2 h-4 w-4" />
      <span> Preview </span>
      <!-- {#if !$countRecords.isLoading}
        <span>
          {count} affected records
        </span>
      {/if} -->
    </Button>
  </Dialog.Trigger>
  <Dialog.Content class="max-w-2/3 flex h-[calc(100vh-40px)] !w-2/3 flex-col overflow-hidden">
    <Dialog.Header>
      <Dialog.Title>Preview Bulk Update Records</Dialog.Title>
    </Dialog.Header>

    <div class="h-full w-full flex-1 overflow-auto">
      <GridView class="h-full w-full border" readonly {viewId} {filter} {r} />
    </div>
  </Dialog.Content>
</Dialog.Root>
