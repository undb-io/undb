<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog"
  import { CREATE_BASE_MODAL, isModalOpen, toggleModal } from "$lib/store/modal.store"
  import CreateBase from "./create-base.svelte"
</script>

<Dialog.Root
  open={$isModalOpen(CREATE_BASE_MODAL)}
  onOpenChange={() => {
    toggleModal(CREATE_BASE_MODAL)
  }}
>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Create Base</Dialog.Title>
    </Dialog.Header>

    <CreateBase />
  </Dialog.Content>
</Dialog.Root>
