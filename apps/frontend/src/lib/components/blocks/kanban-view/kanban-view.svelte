<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import type { Readable, Writable } from "svelte/store"
  import type { KanbanView, RecordDO } from "@undb/table"
  import SelectKanbanField from "./select-kanban-field.svelte"
  import SelectKanbanView from "./select-kanban-view.svelte"
  import TableTools from "../table-tools/table-tools.svelte"
  import { FieldIdVo, Records } from "@undb/table"
  import SelectKanbanRequiresSingle from "./select-kanban-requires-single.svelte"
  import KanbanOptionButton from "./kanban-option-button.svelte"
  import { createRecordsStore, setRecordsStore } from "$lib/store/records.store"

  const table = getTable()
  export let viewId: Readable<string | undefined>
  export let shareId: string | undefined = undefined
  export let readonly = false
  export let records: RecordDO[] | undefined = undefined
  export let disableRecordQuery = false
  export let r: Writable<string | null>


  $: view = $table.views.getViewById($viewId) as KanbanView
  $: fieldId = view.type === "kanban" ? view.field.into(undefined) : undefined
  $: field = fieldId ? $table.schema.getFieldById(new FieldIdVo(fieldId)).into(undefined) : undefined

  const recordsStore = createRecordsStore()
  setRecordsStore(recordsStore)
  if (records) {
    recordsStore.setRecords(new Records(records), Date.now())
  }
</script>

{#key $table.id.value}
  <TableTools {readonly} {viewId} {r} {shareId}>
    {#if !shareId}
      <KanbanOptionButton {view} {readonly} />
    {/if}
  </TableTools>
  {#if view.type === "kanban"}
    {#if field?.type === "select"}
      {#if field.isSingle}
        <SelectKanbanView {view} {shareId} {viewId} {disableRecordQuery} {readonly} {r} />
      {:else}
        <section class="flex h-full w-full items-center justify-center">
          <SelectKanbanRequiresSingle {view} {field} {shareId} />
        </section>
      {/if}
    {:else if !shareId}
      <section class="bg-muted flex h-full w-full items-center justify-center">
        <SelectKanbanField {view} />
      </section>
    {/if}
  {/if}
{/key}
