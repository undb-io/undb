<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import type { Readable } from "svelte/store"
  import SelectKanbanField from "./select-kanban-field.svelte"
  import SelectKanbanView from "./select-kanban-view.svelte"
  import TableTools from "../table-tools/table-tools.svelte"
  import { FieldIdVo } from "@undb/table"
  import SelectKanbanRequiresSingle from "./select-kanban-requires-single.svelte"

  const table = getTable()
  export let viewId: Readable<string>

  $: view = $table.views.getViewById($viewId)
  $: fieldId = view.type === "kanban" ? view.field.into(undefined) : undefined
  $: field = fieldId ? $table.schema.getFieldById(new FieldIdVo(fieldId)).into(undefined) : undefined
</script>

<TableTools />
{#if view.type === "kanban"}
  {#if field?.type === "select"}
    {#if field.isSingle}
      <SelectKanbanView {view} />
    {:else}
      <section class="flex h-full w-full items-center justify-center">
        <SelectKanbanRequiresSingle {view} {field} />
      </section>
    {/if}
  {:else}
    <section class="flex h-full w-full items-center justify-center">
      <SelectKanbanField {view} />
    </section>
  {/if}
{/if}
