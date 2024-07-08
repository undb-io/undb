<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { toast } from "svelte-sonner"
  import * as AlertDialog from "$lib/components/ui/alert-dialog"
  import { LoaderCircleIcon } from "lucide-svelte"

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
</script>

<AlertDialog.Root bind:open>
  <AlertDialog.Trigger asChild let:builder>
    <Button size="sm" variant="outline" builders={[builder]}>
      Delete {ids.length} Record{ids.length > 1 ? "s" : ""}
    </Button>
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
