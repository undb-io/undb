<script lang="ts">
  import CreateRecordSheet from "$lib/components/blocks/create-record/create-record-sheet.svelte"
  import ConfirmDeleteRecord from "$lib/components/blocks/delete-record/confirm-delete-record.svelte"
  import GridView from "$lib/components/blocks/grid-view/grid-view.svelte"
  import { createRecordSheetOpen } from "$lib/components/blocks/create-record/create-record.store.ts"
  import { shortcut } from "@svelte-put/shortcut"
  import TableHeader from "$lib/components/blocks/table-header/table-header.svelte"
  import RecordDetailSheet from "$lib/components/blocks/record-detail/record-detail-sheet.svelte"
  import Openapi from "$lib/components/blocks/openapi/openapi.svelte"
  import { queryParam, ssp } from "sveltekit-search-params"
  import CreateFieldDialog from "$lib/components/blocks/create-field/create-field-dialog.svelte"

  const tab = queryParam("tab", ssp.string())

  function handleR() {
    $createRecordSheetOpen = true
  }
</script>

<TableHeader />

<main class="h-full flex-1 overflow-auto">
  {#if !$tab || $tab === "data"}
    <GridView />
  {:else}
    <Openapi />
  {/if}
</main>

<CreateRecordSheet />
<RecordDetailSheet />
<ConfirmDeleteRecord />
<CreateFieldDialog />

<svelte:window
  use:shortcut={{
    trigger: {
      key: "r",
      modifier: ["ctrl"],
      callback: handleR,
    },
  }}
/>
