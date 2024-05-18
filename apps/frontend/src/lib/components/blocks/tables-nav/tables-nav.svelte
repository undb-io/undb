<script lang="ts">
  import { page } from "$app/stores"
  import { type GetTablesQuery$result } from "$houdini"
  import { Database } from "lucide-svelte"
  import { cn } from "$lib/utils"

  export let tables: GetTablesQuery$result["tables"] = []
</script>

<nav class="grid items-start px-2 text-sm font-medium lg:px-4">
  {#if tables}
    {#each tables as table}
      {@const active = table.id === $page.params.tableId}
      <a
        href={`/t/${table.id}`}
        data-active={active}
        class="text-muted-foreground hover:text-primary data-[active=true]:bg-primary data-[active=true]:text-primary-foreground flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
      >
        <Database class="h-4 w-4" />
        <span>
          {table.name}
        </span>
        <span class={cn("ml-auto text-xs font-normal", active ? "text-muted" : "text-muted-foreground")}>
          {table.recordsCount}
        </span>
      </a>
    {/each}
  {/if}
</nav>
