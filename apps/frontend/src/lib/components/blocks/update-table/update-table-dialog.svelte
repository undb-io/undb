<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog"
  import { isModalOpen, toggleModal, UPDATE_TABLE_MODAL } from "$lib/store/modal.store"
  import UpdateTable from "./update-table.svelte"
</script>

<Dialog.Root
  open={$isModalOpen(UPDATE_TABLE_MODAL)}
  onOpenChange={() => {
    toggleModal(UPDATE_TABLE_MODAL)
  }}
>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Update Table</Dialog.Title>
    </Dialog.Header>

    <UpdateTable />
  </Dialog.Content>
</Dialog.Root>
