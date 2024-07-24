<script lang="ts">
  import { goto, invalidateAll } from "$app/navigation"
  import { GetTableForeignTablesStore } from "$houdini"
  import * as AlertDialog from "$lib/components/ui/alert-dialog"
  import * as Alert from "$lib/components/ui/alert"
  import { DELETE_TABLE_MODAL, isModalOpen } from "$lib/store/modal.store"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { TrashIcon } from "lucide-svelte"
  import { toast } from "svelte-sonner"

  export let table = getTable()

  const foreignTableStore = new GetTableForeignTablesStore()
  $: $isModalOpen(DELETE_TABLE_MODAL) &&
    foreignTableStore.fetch({
      variables: { tableId: $table.id.value },
    })

  $: foreignTables = $foreignTableStore.data?.tableForeignTables ?? []

  const deleteTableMutation = createMutation({
    mutationFn: trpc.table.delete.mutate,
    async onSuccess(data, variables, context) {
      await invalidateAll()
      await goto("/")
    },
    onError(error, variables, context) {
      toast.error(error.message)
    },
  })

  const deleteTable = () => {
    $deleteTableMutation.mutate({ tableId: $table.id.value })
  }
</script>

<AlertDialog.Root open={$isModalOpen(DELETE_TABLE_MODAL)}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you sure to delete table {$table.name.value}?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete the table and remove your data from our servers.
      </AlertDialog.Description>
    </AlertDialog.Header>

    {#if foreignTables.length}
      <Alert.Root class="border-yellow-500 bg-yellow-50">
        <Alert.Title>Deleting foreign table fields</Alert.Title>
        <Alert.Description>
          <p>The following rollup field</p>
          {#each foreignTables as table}{/each}

          <p>will also be deleted.</p>
        </Alert.Description>
      </Alert.Root>
    {/if}

    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action on:click={() => deleteTable()} class="text-background bg-red-500 hover:bg-red-600">
        <TrashIcon class="mr-2 h-4 w-4" />
        Delete
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
