<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import { hasPermission } from "$lib/store/space-member.store"
  import CreateRlsButton from "./create-rls-button.svelte"

  const table = getTable()
</script>

<main class="flex h-full flex-col overflow-hidden">
  <div
    class="flex flex-1 -translate-y-6 items-center justify-center rounded-lg border border-dashed shadow-sm"
    data-x-chunk-name="dashboard-02-chunk-1"
    data-x-chunk-description="An empty state showing no products with a heading, description and a call to action to add a product."
  >
    <div class="flex flex-col items-center gap-3 text-center">
      <h3 class="text-2xl font-bold tracking-tight">{$table.name.value} have no record level security</h3>
      {#if $hasPermission("table:update")}
        <p class="text-muted-foreground text-sm">Click button to create your first record level security policy</p>
        <CreateRlsButton />
      {/if}
    </div>
  </div>
</main>
