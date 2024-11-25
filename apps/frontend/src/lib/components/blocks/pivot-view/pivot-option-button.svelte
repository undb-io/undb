<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { PanelsTopLeftIcon } from "lucide-svelte"
  import * as Dropdown from "$lib/components/ui/dropdown-menu"
  import type { PivotView } from "@undb/table"
  import PivotViewOptionForm from "./pivot-view-option-form.svelte"
  import { useQueryClient } from "@tanstack/svelte-query"
  import { getTable } from "$lib/store/table.store"
  import { LL } from "@undb/i18n/client"

  const table = getTable()

  export let view: PivotView
  export let readonly = false

  let open = false

  const client = useQueryClient()
  const onSuccess = async () => {
    await client.invalidateQueries({ queryKey: ["pivot-data", $table.id.value, view.id.value] })
    open = false
  }
</script>

<Dropdown.Root bind:open portal="body">
  <Dropdown.Trigger asChild let:builder>
    <Button variant="ghost" size="sm" builders={[builder]}>
      <PanelsTopLeftIcon class="text-muted-foreground mr-2 h-4 w-4 font-semibold" />
      {$LL.table.view.pivot.pivot()}
    </Button>
  </Dropdown.Trigger>
  <Dropdown.Content class="w-[400px] px-4 py-2">
    <Dropdown.Label class="px-0 py-2">
      {#if !readonly}
        {$LL.table.view.pivot.update()}
      {:else}
        {$LL.table.view.pivot.view()}
      {/if}
    </Dropdown.Label>
    <PivotViewOptionForm {view} {readonly} {onSuccess} />
  </Dropdown.Content>
</Dropdown.Root>
