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
  import { cn } from "$lib/utils"
  import AuditList from "../audit/audit-list.svelte"
  import { HistoryIcon } from "lucide-svelte"
  import { preferences } from "$lib/store/persisted.store"
  import { ScrollArea } from "$lib/components/ui/scroll-area"

  export let readonly = false

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
</script>

<Sheet.Root
  open={!!$r}
  onOpenChange={(open) => {
    if (!open) {
      r.set("")
    }
  }}
>
  <Sheet.Content
    class={cn(
      "sm:max-w-1/2 flex h-full w-1/2 flex-col gap-0 px-0 py-4 transition-all",
      $preferences.showAudit && "w-2/3",
    )}
    transitionConfig={{ duration: 50 }}
  >
    <Sheet.Header class="border-b px-6 pb-2">
      <Sheet.Title class="flex items-center justify-between">
        <span> Record Detail </span>
        <button class="mr-6" on:click={() => ($preferences.showAudit = !$preferences.showAudit)}>
          <HistoryIcon class="text-muted-foreground h-4 w-4" />
        </button>
      </Sheet.Title>
    </Sheet.Header>

    <div class="flex-1 overflow-hidden">
      {#if $record.isLoading}
        <div class="space-y-4 px-6 py-4">
          <Skeleton class="h-10 w-full" />
          <Skeleton class="h-10 w-full" />
          <Skeleton class="h-10 w-full" />
          <Skeleton class="h-10 w-full" />
          <Skeleton class="h-10 w-full" />
        </div>
      {:else}
        <div class="grid h-full grid-cols-4 overflow-hidden">
          {#if recordDo}
            <div class={cn("overflow-hidden", $preferences.showAudit && $r ? "col-span-3" : "col-span-4")}>
              <ScrollArea class="h-full overflow-auto px-4">
                <RecordDetail {readonly} record={recordDo} bind:disabled />
              </ScrollArea>
            </div>
          {/if}
          {#if $preferences.showAudit && $r}
            <div class="col-span-1 overflow-hidden border-l px-2">
              <ScrollArea class="h-full overflow-auto">
                <AuditList recordId={$r} />
              </ScrollArea>
            </div>
          {/if}
        </div>
      {/if}
    </div>

    {#if !readonly}
      <Sheet.Footer class="border-t px-6 pt-4">
        <Button variant="outline" type="button" on:click={() => ($r = null)}>Cancel</Button>
        <Button type="submit" form="updateRecord" {disabled}>Update</Button>
      </Sheet.Footer>
    {/if}
  </Sheet.Content>
</Sheet.Root>
