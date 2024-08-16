<script lang="ts">
  import { goto, invalidateAll } from "$app/navigation"
  import Button from "$lib/components/ui/button/button.svelte"
  import * as Dialog from "$lib/components/ui/dialog"
  import { closeModal, DUPLICATE_TABLE_MODAL, isModalOpen } from "$lib/store/modal.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import type { TableDo } from "@undb/table"
  import { LoaderCircleIcon } from "lucide-svelte"
  import { toast } from "svelte-sonner"

  export let table: TableDo

  const duplicateTableMutation = createMutation({
    mutationFn: trpc.table.duplicate.mutate,
    onSuccess: async (data) => {
      await invalidateAll()
      closeModal(DUPLICATE_TABLE_MODAL)
      await goto(`/t/${data}`)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
</script>

<Dialog.Root
  open={$isModalOpen(DUPLICATE_TABLE_MODAL)}
  onOpenChange={(open) => {
    if (!open) {
      closeModal(DUPLICATE_TABLE_MODAL)
    }
  }}
>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Duplicate Table {table.name.value}</Dialog.Title>
      <Dialog.Description>
        Create a new table with the same structure as {table.name.value}
      </Dialog.Description>
    </Dialog.Header>

    <div class="item-center flex justify-end gap-2">
      <Button
        on:click={() => {
          closeModal(DUPLICATE_TABLE_MODAL)
        }}
        variant="outline"
      >
        Cancel
      </Button>
      <Button
        disabled={$duplicateTableMutation.isPending}
        on:click={() => {
          $duplicateTableMutation.mutate({ tableId: table.id.value })
        }}
      >
        {#if $duplicateTableMutation.isPending}
          <LoaderCircleIcon class="mr-2 h-5 w-5 animate-spin" />
        {/if}
        Duplicate
      </Button>
    </div>
  </Dialog.Content>
</Dialog.Root>
