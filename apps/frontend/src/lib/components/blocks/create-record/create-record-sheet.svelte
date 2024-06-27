<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet"
  import CreateRecord from "./create-record.svelte"
  import Button from "$lib/components/ui/button/button.svelte"
  import { formId } from "$lib/store/tab.store"
  import { modal, CREATE_RECORD_MODAL, closeModal } from "$lib/store/modal.store"

  let disabled = false
  let dirty = false
</script>

<Sheet.Root
  open={$modal?.includes(CREATE_RECORD_MODAL) ?? false}
  onOpenChange={(open) => {
    if (!open) {
      closeModal(CREATE_RECORD_MODAL)
    }
    if (!open && dirty) {
      if (confirm("Are you sure you want to leave this page? You have unsaved changes that will be lost.")) {
        closeModal(CREATE_RECORD_MODAL)
      }
    }
  }}
>
  <Sheet.Content class="sm:max-w-1/2 flex w-1/2 flex-col" transitionConfig={{ duration: 50 }}>
    <Sheet.Header>
      <Sheet.Title>Create Record</Sheet.Title>
    </Sheet.Header>

    <div class="flex-1">
      <CreateRecord bind:disabled bind:dirty formId={$formId ?? undefined} />
    </div>

    <Sheet.Footer>
      <Button variant="outline" type="button" on:click={() => closeModal(CREATE_RECORD_MODAL)}>Cancel</Button>
      <Button type="submit" form="createRecord">Create</Button>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>
