<script lang="ts">
  import CreateRecordSheet from "$lib/components/blocks/create-record/create-record-sheet.svelte"
  import ConfirmDeleteRecord from "$lib/components/blocks/delete-record/confirm-delete-record.svelte"
  import ConfirmDuplicateRecord from "$lib/components/blocks/duplicate-record/confirm-duplicate-record.svelte"
  import GridView from "$lib/components/blocks/grid-view/grid-view.svelte"
  import { shortcut } from "@svelte-put/shortcut"
  import TableHeader from "$lib/components/blocks/table-header/table-header.svelte"
  import Forms from "$lib/components/blocks/forms/forms.svelte"
  import Auth from "$lib/components/blocks/auth/auth.svelte"
  import RecordDetailSheet from "$lib/components/blocks/record-detail/record-detail-sheet.svelte"
  import Developer from "$lib/components/blocks/developer/developer.svelte"
  import CreateFieldDialog from "$lib/components/blocks/create-field/create-field-dialog.svelte"
  import { tab } from "$lib/store/tab.store"
  import { CREATE_RECORD_MODAL, toggleModal } from "$lib/store/modal.store"
  import UpdateFieldDialog from "$lib/components/blocks/update-field/update-field-dialog.svelte"
  import UpdateViewDialog from "$lib/components/blocks/view/update-view-dialog.svelte"
  import DuplicateViewDialog from "$lib/components/blocks/view/duplicate-view-dialog.svelte"
  import DeleteViewDialog from "$lib/components/blocks/view/delete-view-dialog.svelte"

  function handleR() {
    toggleModal(CREATE_RECORD_MODAL)
  }
</script>

<TableHeader />

<main class="h-full flex-1 overflow-auto">
  {#if !$tab || $tab === "data"}
    <GridView />
  {:else if $tab === "form"}
    <Forms />
  {:else if $tab === "auth"}
    <Auth />
  {:else}
    <Developer />
  {/if}
</main>

<CreateRecordSheet />
<RecordDetailSheet />
<ConfirmDeleteRecord />
<ConfirmDuplicateRecord />
<CreateFieldDialog />
<UpdateFieldDialog />
<UpdateViewDialog />
<DuplicateViewDialog />
<DeleteViewDialog />

<svelte:window
  use:shortcut={{
    trigger: {
      key: "r",
      modifier: ["ctrl"],
      callback: handleR,
    },
  }}
/>
