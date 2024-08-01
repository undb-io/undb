<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog"
  import { DUPLICATE_VIEW, isModalOpen, toggleModal } from "$lib/store/modal.store"
  import DuplicateView from "./duplicate-view.svelte"
</script>

<Dialog.Root
  open={$isModalOpen(DUPLICATE_VIEW)}
  onOpenChange={() => {
    toggleModal(DUPLICATE_VIEW)
  }}
>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Duplicate View</Dialog.Title>
    </Dialog.Header>

    <DuplicateView />
  </Dialog.Content>
</Dialog.Root>
