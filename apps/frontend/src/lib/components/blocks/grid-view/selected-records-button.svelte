<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { toast } from "svelte-sonner"
  import * as AlertDialog from "$lib/components/ui/alert-dialog"
  import { ChevronDownIcon, LoaderCircleIcon } from "lucide-svelte"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"

  const table = getTable()

  export let ids: string[]

  let open = false

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

<div class="flex items-center gap-0">
  <AlertDialog.Root bind:open>
    <AlertDialog.Trigger asChild let:builder>
      <Button size="sm" variant="outline" builders={[builder]} class="rounded-r-none border-r-0">
        Duplicate {ids.length} Record{ids.length > 1 ? "s" : ""}
      </Button>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant="outline" size="sm" class="rounded-l-none px-2">
            <ChevronDownIcon class="text-muted-foreground h-3 w-3" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content class="w-[200px] p-0">
          <DropdownMenu.Group>
            <AlertDialog.Root bind:open>
              <AlertDialog.Trigger asChild let:builder>
                <DropdownMenu.Item asChild class="p-0">
                  <Button
                    size="sm"
                    variant="destructive"
                    class="text-foreground w-full rounded-none border-0 bg-red-50 hover:bg-red-100"
                    builders={[builder]}
                  >
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
