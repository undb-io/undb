<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import { hasPermission } from "$lib/store/space-member.store"
  import CreateFormButton from "./create-form-button.svelte"

  const table = getTable()
</script>

<main class="flex h-full flex-col overflow-hidden">
  <div
    class="flex flex-1 -translate-y-6 items-center justify-center rounded-lg border border-dashed shadow-sm"
    data-x-chunk-name="dashboard-02-chunk-1"
    data-x-chunk-description="An empty state showing no products with a heading, description and a call to action to add a product."
  >
    <div class="flex flex-col items-center gap-1 text-center">
      <h3 class="text-2xl font-bold tracking-tight">{$table.name.value} have no forms</h3>

      {#if $hasPermission("table:update")}
        <p class="text-muted-foreground text-sm">You can start selling as soon as you add a form.</p>
        <CreateFormButton />
      {/if}
    </div>
  </div>
</main>
