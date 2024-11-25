<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import { hasPermission } from "$lib/store/space-member.store"
  import CreateFormButton from "./create-form-button.svelte"
  import { SquareMousePointer } from "lucide-svelte"
  import { LL } from "@undb/i18n/client"

  const table = getTable()
</script>

<main class="flex h-full flex-col overflow-hidden">
  <div
    class="flex flex-1 -translate-y-20 items-center justify-center rounded-lg border border-dashed shadow-sm"
    data-x-chunk-name="dashboard-02-chunk-1"
    data-x-chunk-description="An empty state showing no products with a heading, description and a call to action to add a product."
  >
    <div class="flex flex-col items-center gap-1 text-center">
      <SquareMousePointer class="text-primary h-10 w-10" />
      <h3 class="text-sm font-bold tracking-tight">{$LL.table.form.noForms({tableName: $table.name.value})} </h3>

      {#if $hasPermission("table:update")}
        <p class="text-muted-foreground text-sm">{$LL.table.form.noFormsDescription()}</p>
        <CreateFormButton />
      {/if}
    </div>
  </div>
</main>
