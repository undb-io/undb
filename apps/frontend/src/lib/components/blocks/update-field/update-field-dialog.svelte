<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog"
  import { fieldId } from "$lib/store/field.store"
  import { UPDATE_FIELD_MODAL, isModalOpen, toggleModal } from "$lib/store/modal.store"
  import { getTable } from "$lib/store/table.store"
  import { FieldIdVo } from "@undb/table"
  import UpdateField from "./update-field.svelte"

  const table = getTable()

  $: field = $fieldId ? $table.schema.getFieldById(new FieldIdVo($fieldId)).into(null) : null
  $: console.log($fieldId)
  $: console.log(field)
</script>

<Dialog.Root
  open={$isModalOpen(UPDATE_FIELD_MODAL)}
  onOpenChange={(open) => {
    toggleModal(UPDATE_FIELD_MODAL)
    if (!open) {
      $fieldId = null
    }
  }}
>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Update Field</Dialog.Title>
    </Dialog.Header>

    {#if field}
      <UpdateField {field} />
    {/if}
  </Dialog.Content>
</Dialog.Root>
