<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog"
  import { UPDATE_VIEW, isModalOpen, toggleModal } from "$lib/store/modal.store"
  import UpdateView from "./update-view.svelte"
</script>

<Dialog.Root
  open={$isModalOpen(UPDATE_VIEW)}
  onOpenChange={() => {
    toggleModal(UPDATE_VIEW)
  }}
>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Update View</Dialog.Title>
    </Dialog.Header>

    <UpdateView />
  </Dialog.Content>
</Dialog.Root>
