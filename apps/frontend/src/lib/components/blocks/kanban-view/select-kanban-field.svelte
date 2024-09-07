<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js"
  import type { KanbanView } from "@undb/table"
  import SelectKanbanFieldForm from "./select-kanban-field-form.svelte"

  export let view: KanbanView
</script>

<Card.Root class="w-[450px]">
  <Card.Header>
    <Card.Title>Select kanban field</Card.Title>
    <Card.Description>Select a select type field to group kanban lanes.</Card.Description>
  </Card.Header>
  <Card.Content class="space-y-4">
    <SelectKanbanFieldForm {view} />
  </Card.Content>
</Card.Root>
