<script lang="ts">
  import { HistoryIcon, Maximize2Icon } from "lucide-svelte"
  import * as Sheet from "$lib/components/ui/sheet"
  import { derived, writable, type Readable, type Writable } from "svelte/store"
  import { RecordDO, type TableDo } from "@undb/table"
  import { Button } from "$lib/components/ui/button"
  import { ScrollArea } from "$lib/components/ui/scroll-area"
  import { Skeleton } from "$lib/components/ui/skeleton"
  import { preferences } from "$lib/store/persisted.store"
  import AuditList from "../audit/audit-list.svelte"
  import RecordDetail from "../record-detail/record-detail.svelte"
  import { cn } from "$lib/utils"
  import { createQuery, useQueryClient } from "@tanstack/svelte-query"
  import { getDataService } from "$lib/store/data-service.store"

  export let foreignTable: Readable<TableDo>
  export let r: Writable<string | null>

  export let recordId: Readable<string>
  export let readonly = false
  export let viewId: Readable<string | undefined>

  const client = useQueryClient()

  const open = writable(false)
  let disabled = false

  const dataService = getDataService()

  const record = createQuery(
    derived([foreignTable, recordId, preferences, open], ([$table, $recordId, $preferences, $open]) => ({
      queryKey: [$recordId, "get", $preferences.showHiddenFields, $open],
      queryFn: () =>
        dataService.records.getRecordById({
          tableId: $table?.id.value,
          id: $recordId!,
          select: $preferences.showHiddenFields ? undefined : $table?.getOrderedVisibleFields().map((f) => f.id.value),
        }),
      enabled: !!$recordId && !!$open,
    })),
  )

  $: recordDo = $record.data?.record ? RecordDO.fromJSON($foreignTable, $record.data?.record) : undefined
</script>

<Sheet.Root bind:open={$open}>
  <Sheet.Trigger asChild let:builder>
    <Button variant="outline" size="xs" class={cn("h-7 w-7", $$restProps.class)} builders={[builder]}>
      <Maximize2Icon class="h-4 w-4" />
    </Button>
  </Sheet.Trigger>
  <Sheet.Content
    class={cn(
      "sm:max-w-1/2 flex h-full w-1/2 flex-col gap-0 px-0 py-4 transition-all",
      $preferences.showAudit && "w-2/3",
    )}
    transitionConfig={{ duration: 50 }}
  >
    <Sheet.Header class="border-b px-6 pb-2">
      <Sheet.Title class="flex items-center justify-between gap-1">
        <div class="flex items-center gap-1">
          <span>
            Record Detail for {$foreignTable.name.value}
          </span>

          <span
            class="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20"
          >
            Foreign Table
          </span>
        </div>

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
            <div class={cn("overflow-hidden", $preferences.showAudit && $recordId ? "col-span-3" : "col-span-4")}>
              <ScrollArea class="h-full overflow-auto px-6">
                <RecordDetail
                  {readonly}
                  {viewId}
                  onSuccess={async () => {
                    $open = false

                    await client.invalidateQueries({
                      queryKey: ["records", $foreignTable.id.value],
                    })
                  }}
                  {r}
                  table={foreignTable}
                  record={recordDo}
                  bind:disabled
                />
              </ScrollArea>
            </div>
          {/if}
          {#if $preferences.showAudit && $recordId}
            <div class="col-span-1 overflow-hidden border-l px-2">
              <ScrollArea class="h-full overflow-auto">
                <AuditList recordId={$recordId} />
              </ScrollArea>
            </div>
          {/if}
        </div>
      {/if}
    </div>

    <Sheet.Footer class="border-t px-6 pt-4">
      <Button variant="outline" type="button">Cancel</Button>
      <Button type="submit" form={`${$foreignTable.id.value}:updateRecord`} {disabled}>Update</Button>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>
