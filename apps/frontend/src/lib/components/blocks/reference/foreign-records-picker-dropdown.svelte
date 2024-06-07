<script lang="ts">
  import { GetForeignTableStore } from "$houdini"
  import * as Popover from "$lib/components/ui/popover"
  import ForeignRecordsPicker from "./foreign-records-picker.svelte"
  import { readable } from "svelte/store"
  import { TableCreator } from "@undb/table"

  export let foreignTableId: string
  export let value: string[] = []

  const foreignTableStore = new GetForeignTableStore()

  foreignTableStore.fetch({ variables: { tableId: foreignTableId } })

  $: table = $foreignTableStore.data?.table

  $: foreignTable = table ? readable(new TableCreator().fromJSON(table)) : null
</script>

<Popover.Root>
  <Popover.Trigger>
    <button type="button"> + </button>
  </Popover.Trigger>
  <Popover.Content class="w-1/2 lg:max-w-4xl">
    {#if foreignTable}
      <ForeignRecordsPicker {foreignTable} bind:selected={value} />
    {/if}
  </Popover.Content>
</Popover.Root>
