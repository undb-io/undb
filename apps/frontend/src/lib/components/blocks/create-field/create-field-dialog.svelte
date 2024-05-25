<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog"
  import { CREATE_FIELD_MODAL, modal, toggleModal } from "$lib/store/modal.store"
  import CreateField from "./create-field.svelte"
</script>

<Dialog.Root
  open={$modal?.includes(CREATE_FIELD_MODAL)}
  onOpenChange={() => {
    toggleModal(CREATE_FIELD_MODAL)
  }}
>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Create Field</Dialog.Title>
    </Dialog.Header>

    <CreateField />
  </Dialog.Content>
</Dialog.Root>
