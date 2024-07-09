<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { toast } from "svelte-sonner"
  import * as AlertDialog from "$lib/components/ui/alert-dialog"
  import { ChevronDownIcon, CopyPlusIcon, LoaderCircleIcon, PencilIcon, Trash2Icon } from "lucide-svelte"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import * as Sheet from "$lib/components/ui/sheet"
  import BulkUpdateRecords from "../bulk-update-records/bulk-update-records.svelte"
  import { ID_TYPE } from "@undb/table"
  import { cn } from "$lib/utils"

  const table = getTable()

  export let ids: string[]

  let open = false
  let dropdownOpen = false
  let updateOpen = false

  const client = useQueryClient()
  const deleteRecordsMutation = createMutation({
    mutationFn: trpc.record.bulkDelete.mutate,
    onSuccess(data, variables, context) {
      client.invalidateQueries({
        queryKey: ["records", $table.id.value],
      })
      toast.success("Record has been deleted!")
      open = false
    },
  })

  const deleteRecords = () => {
    if ($deleteRecordsMutation.isPending) return
    if (!ids.length) return

    $deleteRecordsMutation.mutate({
      tableId: $table.id.value,
      ids: ids as [string, ...string[]],
    })
  }

  const duplicateRecordsMutation = createMutation({
    mutationFn: trpc.record.bulkDuplicate.mutate,
    onSuccess(data, variables, context) {
      client.invalidateQueries({
        queryKey: ["records", $table.id.value],
      })
      toast.success("Record has been duplicated!")
    },
  })

  const duplicateRecords = () => {
    if ($duplicateRecordsMutation.isPending) return
    if (!ids.length) return

    $duplicateRecordsMutation.mutate({
      tableId: $table.id.value,
      ids: ids as [string, ...string[]],
    })
  }
</script>

<div class={cn("flex items-center gap-0 opacity-0", $$restProps.class)}>
  <AlertDialog.Root bind:open>
    <AlertDialog.Trigger asChild let:builder>
      <Button size="sm" variant="outline" builders={[builder]} class="rounded-r-none border-r-0">
        <CopyPlusIcon class="mr-2 h-3 w-3" />
        Duplicate {ids.length} Record{ids.length > 1 ? "s" : ""}
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
                    Update Record{ids.length > 1 ? "s" : ""}
                  </Button>
                </DropdownMenu.Item>
              </Sheet.Trigger>
              <Sheet.Content class="sm:max-w-1/2 flex h-full w-1/2 flex-col gap-0 px-0 py-4 transition-all">
                <Sheet.Header class="flex flex-row items-center justify-between border-b px-6 pb-4">
                  <Sheet.Title class="flex-1">Bulk update {ids.length} Records</Sheet.Title>
                  <!-- <Button size="sm" class="mr-5" type="submit" form="bulkUpdateRecords">Bulk Update</Button> -->
                </Sheet.Header>

                <BulkUpdateRecords
                  customFilter
                  onSuccess={() => {
                    updateOpen = false
                    dropdownOpen = false
                  }}
                  filter={{
                    conjunction: "and",
                    children: [{ fieldId: ID_TYPE, op: "in", value: ids }],
                  }}
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
                    Delete {ids.length} Record{ids.length > 1 ? "s" : ""}
                  </Button>
                </DropdownMenu.Item>
              </AlertDialog.Trigger>
              <AlertDialog.Content>
                <AlertDialog.Header>
                  <AlertDialog.Title>Delete {ids.length} Records?</AlertDialog.Title>
                  <AlertDialog.Description>
                    This action cannot be undone. This will permanently delete records from {$table.name.value}.
                  </AlertDialog.Description>
                </AlertDialog.Header>
                <AlertDialog.Footer>
                  <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                  <AlertDialog.Action
                    disabled={$deleteRecordsMutation.isPending}
                    on:click={deleteRecords}
                    class="text-background bg-red-500 hover:bg-red-700"
                  >
                    {#if $deleteRecordsMutation.isPending}
                      <LoaderCircleIcon class="mr-2 h-5 w-5 animate-spin" />
                    {/if}
                    Delete
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
        <AlertDialog.Title>Duplicate {ids.length} Records?</AlertDialog.Title>
        <AlertDialog.Description>
          This action will duplicate {ids.length} records of table {$table.name.value}.
        </AlertDialog.Description>
      </AlertDialog.Header>
      <AlertDialog.Footer>
        <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
        <AlertDialog.Action disabled={$duplicateRecordsMutation.isPending} on:click={duplicateRecords}>
          {#if $duplicateRecordsMutation.isPending}
            <LoaderCircleIcon class="mr-2 h-5 w-5 animate-spin" />
          {/if}
          Duplicate
        </AlertDialog.Action>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Root>
</div>
