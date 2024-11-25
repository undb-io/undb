<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { KanbanSquareDashedIcon } from "lucide-svelte"
  import * as Dropdown from "$lib/components/ui/dropdown-menu"
  import SelectKanbanFieldForm from "./select-kanban-field-form.svelte"
  import type { KanbanView } from "@undb/table"
  import { LL } from "@undb/i18n/client"

  export let view: KanbanView
  export let readonly = false
</script>

<Dropdown.Root>
  <Dropdown.Trigger asChild let:builder>
    <Button variant="ghost" size="sm" builders={[builder]}>
      <KanbanSquareDashedIcon class="text-muted-foreground mr-2 h-4 w-4 font-semibold" />
      {$LL.table.view.kanban.kanban()}
    </Button>
  </Dropdown.Trigger>
  <Dropdown.Content class="w-[400px] p-2">
    <Dropdown.Label>
      {#if !readonly}
        {$LL.table.view.kanban.update()}
      {:else}
        {$LL.table.view.kanban.view()}
      {/if}
    </Dropdown.Label>
    <SelectKanbanFieldForm {view} {readonly} />
  </Dropdown.Content>
</Dropdown.Root>
