<script lang="ts">
  import * as Alert from "$lib/components/ui/alert/index.js"
  import type { KanbanView, SelectField } from "@undb/table"
  import SelectKanbanFieldForm from "./select-kanban-field-form.svelte"

  export let field: SelectField
  export let view: KanbanView
  export let shareId: string | undefined = undefined
</script>

<Alert.Root class="max-w-prose space-y-4">
  <Alert.Title>Kanban Select Field requires single option</Alert.Title>
  <Alert.Description>
    You are using a select field with multiple options. Please select a single option field.
  </Alert.Description>

  {#if !shareId}
    <SelectKanbanFieldForm {view} />
  {/if}
</Alert.Root>
