<script lang="ts">
  import { GetForeignTableStore } from "$houdini"
  import * as Dialog from "$lib/components/ui/dialog"
  import { foreignTableId } from "./foreign-table-picker.store"
  import ForeignRecordsPicker from "./foreign-records-picker.svelte"
  import { readable } from "svelte/store"
  import { TableCreator } from "@undb/table"

  const foreignTableStore = new GetForeignTableStore()

  $: if ($foreignTableId) {
    foreignTableStore.fetch({ variables: { tableId: $foreignTableId } })
  }

  $: table = $foreignTableStore.data?.table

  $: foreignTable = table ? readable(new TableCreator().fromJSON(table)) : null
</script>

<Dialog.Root
  open={!!$foreignTableId}
  onOpenChange={(open) => {
    if (!open) {
      $foreignTableId = null
    }
  }}
>
  <Dialog.Content class="w-1/2 lg:max-w-4xl">
    <Dialog.Header>
      <Dialog.Title>Select Foreign Table</Dialog.Title>
    </Dialog.Header>

    {#if foreignTable}
      <ForeignRecordsPicker {foreignTable} />
    {/if}
  </Dialog.Content>
</Dialog.Root>
