<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import type { Readable } from "svelte/store"
  import type { KanbanView } from "@undb/table"
  import SelectKanbanField from "./select-kanban-field.svelte"
  import SelectKanbanView from "./select-kanban-view.svelte"
  import TableTools from "../table-tools/table-tools.svelte"
  import { FieldIdVo } from "@undb/table"
  import SelectKanbanRequiresSingle from "./select-kanban-requires-single.svelte"
  import KanbanOptionButton from "./kanban-option-button.svelte"

  const table = getTable()
  export let viewId: Readable<string>
  export let shareId: string | undefined = undefined

  $: view = $table.views.getViewById($viewId) as KanbanView
  $: fieldId = view.type === "kanban" ? view.field.into(undefined) : undefined
  $: field = fieldId ? $table.schema.getFieldById(new FieldIdVo(fieldId)).into(undefined) : undefined
</script>

<TableTools>
  <KanbanOptionButton {view} />
</TableTools>
{#if view.type === "kanban"}
  {#if field?.type === "select"}
    {#if field.isSingle}
      <SelectKanbanView {view} {shareId} {viewId} />
    {:else}
      <section class="flex h-full w-full items-center justify-center">
        <SelectKanbanRequiresSingle {view} {field} {shareId} />
      </section>
    {/if}
  {:else if !shareId}
    <section class="flex h-full w-full items-center justify-center">
      <SelectKanbanField {view} />
    </section>
  {/if}
{/if}

{#await import("$lib/components/blocks/create-record/create-record-sheet.svelte") then { default: CreateRecordSheet }}
  <CreateRecordSheet />
{/await}

{#await import("$lib/components/blocks/record-detail/table-record-detail-sheet.svelte") then { default: TableRecordDetailSheet }}
  <TableRecordDetailSheet />
{/await}
