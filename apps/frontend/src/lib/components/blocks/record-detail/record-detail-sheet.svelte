<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet"
  import Button from "$lib/components/ui/button/button.svelte"
  import RecordDetail from "./record-detail.svelte"
  import { getTable } from "$lib/store/table.store"
  import { useIsMutating, useQueryClient } from "@tanstack/svelte-query"
  import { RecordDO } from "@undb/table"
  import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte"
  import { cn } from "$lib/utils"
  import AuditList from "../audit/audit-list.svelte"
  import { LoaderCircleIcon } from "lucide-svelte"
  import { preferences } from "$lib/store/persisted.store"
  import { ScrollArea } from "$lib/components/ui/scroll-area"
  import RecordDetailMenu from "./record-detail-menu.svelte"
  import { type Writable, type Readable } from "svelte/store"
  import { LL } from "@undb/i18n/client"

  export let readonly = false
  export let recordDo: RecordDO | undefined
  export let isLoading: boolean
  export let viewId: Readable<string | undefined>
  export let r: Writable<string | null>

  const table = getTable()
  const isUpdatingRecord = useIsMutating({
    mutationKey: ["updateRecord"],
  })

  const client = useQueryClient()

  let disabled = false
</script>

<Sheet.Root
  open={!!$r}
  onOpenChange={(open) => {
    if (!open) {
      $r = null
    }
  }}
  portal="body"
>
  <Sheet.Content
    class={cn(
      "lg:max-w-2/3 xl:max-w-1/2 flex h-full !max-w-none flex-col gap-0 px-0 py-4 transition-all lg:w-2/3 xl:w-1/2",
      $preferences.showAudit && "w-2/3",
    )}
    transitionConfig={{ duration: 50 }}
  >
    <Sheet.Header class="border-b px-6 pb-2">
      <Sheet.Title class="flex items-center justify-between pr-10">
        <span>{$LL.table.record.detail()}</span>
        <!-- <button disabled class="mr-6" on:click={() => ($preferences.showAudit = !$preferences.showAudit)}>
          <HistoryIcon class="text-muted-foreground h-4 w-4" />
        </button> -->
        <RecordDetailMenu {r} />
      </Sheet.Title>
    </Sheet.Header>

    <div class="flex-1 overflow-hidden">
      {#if isLoading}
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
              <div class="h-full w-full overflow-auto px-6">
                <RecordDetail
                  {viewId}
                  onSuccess={async () => {
                    $r = null
                    await client.invalidateQueries({ queryKey: ["records", $table.id.value] })
                  }}
                  {r}
                  {table}
                  {readonly}
                  record={recordDo}
                  bind:disabled
                />
              </div>
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
        <Button variant="outline" type="button" on:click={() => ($r = null)}>{$LL.common.cancel()}</Button>
        <Button type="submit" form={`${$table.id.value}:updateRecord`} disabled={disabled || $isUpdatingRecord > 0}>
          {#if $isUpdatingRecord > 0}
            <LoaderCircleIcon class="mr-2 h-5 w-5 animate-spin" />
          {/if}
          {$LL.table.record.update()}
        </Button>
      </Sheet.Footer>
    {/if}
  </Sheet.Content>
</Sheet.Root>
