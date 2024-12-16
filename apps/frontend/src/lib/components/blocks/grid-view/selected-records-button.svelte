<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte"
  import { getTable } from "$lib/store/table.store"
  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { toast } from "svelte-sonner"
  import * as AlertDialog from "$lib/components/ui/alert-dialog"
  import { ChevronDownIcon, CopyPlusIcon, LoaderCircleIcon, PencilIcon, Trash2Icon } from "lucide-svelte"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import * as Sheet from "$lib/components/ui/sheet"
  import BulkUpdateRecords from "../bulk-update-records/bulk-update-records.svelte"
  import { ID_TYPE } from "@undb/table"
  import { cn } from "$lib/utils"
  import { r } from "$lib/store/records.store"
  import type { Readable } from "svelte/store"
  import { LL } from "@undb/i18n/client"
  import { getDataService } from "$lib/store/data-service.store"

  const dataService = getDataService()

  const table = getTable()

  export let ids: string[]
  export let viewId: Readable<string | undefined>

  let open = false
  let dropdownOpen = false
  let updateOpen = false

  export let onDuplicateSuccess: () => void = () => {}
  export let onDeleteSuccess: () => void = () => {}

  const client = useQueryClient()
  const deleteRecordsMutation = createMutation({
    mutationFn: dataService.records.deleteRecords,
    onSuccess(data, variables, context) {
      client.invalidateQueries({
        queryKey: ["records", $table.id.value],
      })
      toast.success("Record has been deleted!")
      onDeleteSuccess()
      open = false
    },
  })

  const deleteRecords = () => {
    if ($deleteRecordsMutation.isPending) return
    if (!ids.length) return

    $deleteRecordsMutation.mutate({
      tableId: $table.id.value,
      filter: {
        conjunction: "and",
        children: [{ field: ID_TYPE, op: "in", value: ids }],
      },
    })
  }

  const duplicateRecordsMutation = createMutation({
    mutationFn: dataService.records.duplicateRecords,
    async onSuccess(data, variables, context) {
      await client.invalidateQueries({
        queryKey: ["records", $table.id.value],
      })
      toast.success($LL.table.record.bulkDuplicated())
      onDuplicateSuccess()
    },
  })

  const duplicateRecords = () => {
    if ($duplicateRecordsMutation.isPending) return
    if (!ids.length) return

    $duplicateRecordsMutation.mutate({
      tableId: $table.id.value,
      filter: {
        conjunction: "and",
        children: [{ field: ID_TYPE, op: "in", value: ids }],
      },
    })
  }
</script>

<div class={cn("flex items-center gap-0 opacity-0", $$restProps.class)}>
  <AlertDialog.Root bind:open>
    <AlertDialog.Trigger asChild let:builder>
      <Button size="sm" variant="outline" builders={[builder]} class="rounded-r-none border-r-0">
        <CopyPlusIcon class="mr-2 h-3 w-3" />
        {$LL.table.record.duplicate({ n: ids.length })}
      </Button>

      <DropdownMenu.Root bind:open={dropdownOpen}>
        <DropdownMenu.Trigger>
          <Button variant="outline" size="sm" class="rounded-l-none px-2">
            <ChevronDownIcon class="text-muted-foreground h-3 w-3" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content class="w-[200px] p-0">
          <DropdownMenu.Group>
            <Sheet.Root bind:open={updateOpen}>
              <Sheet.Trigger asChild let:builder>
                <DropdownMenu.Item asChild class="p-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    class="text-foreground w-full justify-start rounded-none border-0 text-xs font-normal"
                    builders={[builder]}
                  >
                    <PencilIcon class="mr-2 h-3 w-3" />
                    {$LL.table.record.updateRecords({ n: ids.length })}
                  </Button>
                </DropdownMenu.Item>
              </Sheet.Trigger>
              <Sheet.Content class="sm:max-w-1/2 flex h-full w-2/3 flex-col gap-0 px-0 py-4 transition-all">
                <Sheet.Header class="flex flex-row items-center justify-between border-b px-6 pb-4">
                  <Sheet.Title class="flex-1">{$LL.table.record.bulkUpdateRecords({ n: ids.length })}</Sheet.Title>
                  <!-- <Button size="sm" class="mr-5" type="submit" form="bulkUpdateRecords">Bulk Update</Button> -->
                </Sheet.Header>

                <BulkUpdateRecords
                  {viewId}
                  customFilter
                  onSuccess={() => {
                    updateOpen = false
                    dropdownOpen = false
                  }}
                  filter={{
                    conjunction: "and",
                    children: [{ field: ID_TYPE, op: "in", value: ids }],
                  }}
                  {r}
                />
              </Sheet.Content>
            </Sheet.Root>

            <DropdownMenu.Separator class="my-0" />
            <AlertDialog.Root bind:open>
              <AlertDialog.Trigger asChild let:builder>
                <DropdownMenu.Item asChild class="p-0">
                  <Button
                    size="sm"
                    variant="destructive"
                    class="bg-background w-full justify-start rounded-none border-0 text-xs font-normal text-red-500 hover:bg-red-50"
                    builders={[builder]}
                  >
                    <Trash2Icon class="mr-2 h-3 w-3" />
                    {$LL.table.record.deleteRecords({ n: ids.length })}
                  </Button>
                </DropdownMenu.Item>
              </AlertDialog.Trigger>
              <AlertDialog.Content>
                <AlertDialog.Header>
                  <AlertDialog.Title>{$LL.table.record.confirmDeleteRecords({ n: ids.length })}</AlertDialog.Title>
                  <AlertDialog.Description>
                    {$LL.table.record.confirmDeleteRecordsDescription({ table: $table.name.value })}
                  </AlertDialog.Description>
                </AlertDialog.Header>
                <AlertDialog.Footer>
                  <AlertDialog.Cancel>{$LL.common.cancel()}</AlertDialog.Cancel>
                  <AlertDialog.Action
                    disabled={$deleteRecordsMutation.isPending}
                    on:click={deleteRecords}
                    class="text-background bg-red-500 hover:bg-red-700"
                  >
                    {#if $deleteRecordsMutation.isPending}
                      <LoaderCircleIcon class="mr-2 h-5 w-5 animate-spin" />
                    {/if}
                    {$LL.common.delete()}
                  </AlertDialog.Action>
                </AlertDialog.Footer>
              </AlertDialog.Content>
            </AlertDialog.Root>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </AlertDialog.Trigger>
    <AlertDialog.Content>
      <AlertDialog.Header>
        <AlertDialog.Title>{$LL.table.record.confirmDuplicateRecords({ n: ids.length })}</AlertDialog.Title>
        <AlertDialog.Description>
          {$LL.table.record.confirmDuplicateRecordsDescription({ table: $table.name.value, n: ids.length })}
        </AlertDialog.Description>
      </AlertDialog.Header>
      <AlertDialog.Footer>
        <AlertDialog.Cancel>{$LL.common.cancel()}</AlertDialog.Cancel>
        <AlertDialog.Action disabled={$duplicateRecordsMutation.isPending} on:click={duplicateRecords}>
          {#if $duplicateRecordsMutation.isPending}
            <LoaderCircleIcon class="mr-2 h-5 w-5 animate-spin" />
          {/if}
          {$LL.common.duplicate()}
        </AlertDialog.Action>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Root>
</div>
