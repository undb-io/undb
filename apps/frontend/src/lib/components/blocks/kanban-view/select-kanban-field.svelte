<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js"
  import type { KanbanView } from "@undb/table"
  import SelectKanbanFieldForm from "./select-kanban-field-form.svelte"
  import { LL } from "@undb/i18n/client"

  export let view: KanbanView
</script>

<Card.Root class="w-[450px]">
  <Card.Header>
    <Card.Title>{$LL.table.view.kanban.field()}</Card.Title>
    <Card.Description>{$LL.table.view.kanban.groupBy()}</Card.Description>
  </Card.Header>
  <Card.Content class="space-y-4">
    <SelectKanbanFieldForm {view} />
  </Card.Content>
</Card.Root>
