<script lang="ts">
  import CreateRecordSheet from "$lib/components/blocks/create-record/create-record-sheet.svelte"
  import ConfirmDeleteRecord from "$lib/components/blocks/delete-record/confirm-delete-record.svelte"
  import GridView from "$lib/components/blocks/grid-view/grid-view.svelte"
  import { createRecordSheetOpen } from "$lib/components/blocks/create-record/create-record.store.ts"
  import type { PageData } from "./$types"
  import { shortcut, type ShortcutEventDetail } from "@svelte-put/shortcut"
  import TableHeader from "$lib/components/blocks/table-header/table-header.svelte"

  export let data: PageData
  function handleR(detail: ShortcutEventDetail) {
    $createRecordSheetOpen = true
  }
</script>

<TableHeader />
<GridView />

<CreateRecordSheet data={data.createRecord} />
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
