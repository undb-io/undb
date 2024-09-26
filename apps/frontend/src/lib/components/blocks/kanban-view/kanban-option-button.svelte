<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { KanbanSquareDashedIcon } from "lucide-svelte"
  import * as Dropdown from "$lib/components/ui/dropdown-menu"
  import SelectKanbanFieldForm from "./select-kanban-field-form.svelte"
  import type { KanbanView } from "@undb/table"

  export let view: KanbanView
  export let readonly = false
</script>

<Dropdown.Root>
  <Dropdown.Trigger asChild let:builder>
    <Button variant="ghost" size="sm" builders={[builder]}>
      <KanbanSquareDashedIcon class="text-muted-foreground mr-2 h-4 w-4 font-semibold" />
      Kanban
    </Button>
  </Dropdown.Trigger>
  <Dropdown.Content class="w-[400px] p-2">
    <Dropdown.Label>
      {#if !readonly}
        Update kanban view
      {:else}
        Kanban view
      {/if}
    </Dropdown.Label>
    <SelectKanbanFieldForm {view} {readonly} />
  </Dropdown.Content>
</Dropdown.Root>
