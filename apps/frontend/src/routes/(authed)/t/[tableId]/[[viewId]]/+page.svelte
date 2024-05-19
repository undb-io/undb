<script lang="ts">
  import CreateRecordSheet from "$lib/components/blocks/create-record/create-record-sheet.svelte"
  import ConfirmDeleteRecord from "$lib/components/blocks/delete-record/confirm-delete-record.svelte"
  import GridView from "$lib/components/blocks/grid-view/grid-view.svelte"
  import { createRecordSheetOpen } from "$lib/components/blocks/create-record/create-record.store.ts"
  import { shortcut, type ShortcutEventDetail } from "@svelte-put/shortcut"
  import TableHeader from "$lib/components/blocks/table-header/table-header.svelte"

  function handleR(detail: ShortcutEventDetail) {
    $createRecordSheetOpen = true
  }
</script>

<TableHeader />
<main class="h-full flex-1 overflow-auto">
  <GridView />
</main>

<CreateRecordSheet />
<ConfirmDeleteRecord />

<svelte:window
  use:shortcut={{
    trigger: {
      key: "r",
      modifier: ["ctrl"],
      callback: handleR,
    },
  }}
/>
