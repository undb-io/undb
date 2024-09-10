<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { KanbanSquareDashedIcon } from "lucide-svelte"
  import * as Dialog from "$lib/components/ui/dialog"
  import SelectKanbanFieldForm from "./select-kanban-field-form.svelte"
  import type { KanbanView } from "@undb/table"

  export let view: KanbanView
</script>

<Dialog.Root>
  <Dialog.Trigger>
    <Button variant="ghost" size="sm">
      <KanbanSquareDashedIcon class="text-muted-foreground mr-2 h-4 w-4 font-semibold" />
      Kanban
    </Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Update kanban view option</Dialog.Title>
    </Dialog.Header>

    <SelectKanbanFieldForm {view} />
  </Dialog.Content>
</Dialog.Root>
