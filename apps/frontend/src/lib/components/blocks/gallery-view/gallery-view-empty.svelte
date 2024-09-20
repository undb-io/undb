<script lang="ts">
  import { hasPermission } from "$lib/store/space-member.store"
  import { getTable } from "$lib/store/table.store"
  import { SquareMousePointer } from "lucide-svelte"
  import CreateRecordButton from "../create-record/create-record-button.svelte"

  export let readonly = false
  const table = getTable()
</script>

<div class="flex h-full w-screen flex-1 -translate-x-10 -translate-y-20 items-center justify-center shadow-sm">
  <div class="flex flex-col items-center gap-1 space-y-2 text-center">
    <SquareMousePointer class="text-primary h-10 w-10" />
    <h3 class="text-sm font-bold tracking-tight">{$table.name.value} have no records</h3>
    {#if !readonly && $hasPermission("record:create")}
      <p class="text-muted-foreground text-sm">
        You can click button or use shortcut <code class="bg-muted rounded px-[0.3rem] py-[0.2rem]">Ctrl + R</code> and create
        your first record
      </p>
      <CreateRecordButton variant="default" size="default" />
    {/if}
  </div>
</div>
