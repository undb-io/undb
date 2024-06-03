<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog"
  import { CREATE_RLS_MODAL, isModalOpen, toggleModal } from "$lib/store/modal.store"
  import CreateRLS from "./create-rls.svelte"
</script>

<Dialog.Root
  open={$isModalOpen(CREATE_RLS_MODAL)}
  onOpenChange={() => {
    toggleModal(CREATE_RLS_MODAL)
  }}
>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Create Record Level Security</Dialog.Title>
    </Dialog.Header>

    <CreateRLS />
  </Dialog.Content>
</Dialog.Root>
