<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog"
  import { IMPORT_TABLE_MODAL, isModalOpen, toggleModal } from "$lib/store/modal.store"
  import ImportTable from "./import-table.svelte"

  export let tableNames: string[]
</script>

<Dialog.Root open={$isModalOpen(IMPORT_TABLE_MODAL)} onOpenChange={(open) => toggleModal(IMPORT_TABLE_MODAL)}>
  <Dialog.Content class="max-w-3xl">
    <Dialog.Header>Import Data - CSV / JSON / Excel</Dialog.Header>
    <ImportTable {tableNames} />
  </Dialog.Content>
</Dialog.Root>
