<script lang="ts">
  import { goto, invalidateAll } from "$app/navigation"
  import * as AlertDialog from "$lib/components/ui/alert-dialog"
  import { closeModal, DELETE_TABLE_MODAL, isModalOpen } from "$lib/store/modal.store"
  import { getTable } from "$lib/store/table.store"
  import { createMutation } from "@tanstack/svelte-query"
  import { TrashIcon } from "lucide-svelte"
  import { toast } from "svelte-sonner"
  import { Input } from "$lib/components/ui/input"
  import { Label } from "$lib/components/ui/label"
  import { LL } from "@undb/i18n/client"
  import { type IDeleteTableCommand } from "@undb/commands"
  import { getDataService } from "$lib/store/data-service.store"

  export let table = getTable()

  const dataService = getDataService()

  // const foreignTableStore = new GetTableForeignTablesStore()
  // $: $isModalOpen(DELETE_TABLE_MODAL) &&
  //   foreignTableStore.fetch({
  //     variables: { tableId: $table.id.value },
  //   })

  // $: foreignTables = $foreignTableStore.data?.tableForeignTables ?? []

  const deleteTableMutation = createMutation({
    mutationFn: dataService.table.deleteTable,
    async onSuccess(data, variables, context) {
      await goto("/")
      await invalidateAll()
    },
    onError(error, variables, context) {
      toast.error(error.message)
    },
  })

  const deleteTable = () => {
    $deleteTableMutation.mutate({ tableId: $table.id.value })
  }

  let tableName: string = ""
  $: disabled = tableName !== $table.name.value
</script>

<AlertDialog.Root
  open={$isModalOpen(DELETE_TABLE_MODAL)}
  onOpenChange={(open) => {
    if (!open) {
      closeModal(DELETE_TABLE_MODAL)
    }
  }}
>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you sure to delete table {$table.name.value}?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete the table and remove your data from our servers.
      </AlertDialog.Description>
    </AlertDialog.Header>

    <Label class="text-muted-foreground space-y-2">
      <span> Input table name to confirm deletion </span>
      <Input bind:value={tableName} placeholder={$table.name.value} />
    </Label>

    <!-- {#if foreignTables.length}
      <Alert.Root class="border-yellow-500 bg-yellow-50">
        <Alert.Title>Deleting foreign table fields</Alert.Title>
        <Alert.Description>
          <p>All the foreign table reference and rollup fields will also be deleted</p>
        </Alert.Description>
      </Alert.Root>
    {/if} -->

    <AlertDialog.Footer>
      <AlertDialog.Cancel>{$LL.common.cancel()}</AlertDialog.Cancel>
      <AlertDialog.Action
        {disabled}
        on:click={() => deleteTable()}
        class="text-background bg-red-500 transition-colors hover:bg-red-600"
      >
        <TrashIcon class="mr-2 h-4 w-4" />
        {$LL.common.delete()}
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
