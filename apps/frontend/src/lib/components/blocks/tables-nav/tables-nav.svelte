<script lang="ts">
  import { page } from "$app/stores"
  import { type GetIndexQuery$result } from "$houdini"
  import * as Accordion from "$lib/components/ui/accordion"
  import TablesNavItem from "./tables-nav-item.svelte"

  export let tables: GetIndexQuery$result["tables"] = []
  export let bases: GetIndexQuery$result["bases"] = []

  let el: HTMLElement
  $: tables, el?.querySelector('[data-active="true"]')?.scrollIntoView()

  $: tableId = $page.params.tableId

  $: tablesWithoutBase = tables.filter((t) => !t?.baseId)
</script>

<nav bind:this={el} class="grid items-start px-2 text-sm font-medium lg:px-4">
  <Accordion.Root value={tableId}>
    {#if bases && tables}
      {#each bases as base}
        {@const baseTables = tables.filter((t) => t?.baseId === base?.id)}
        {#each baseTables as table}
          <TablesNavItem {table} />
        {/each}
      {/each}
    {/if}
    {#each tablesWithoutBase as table}
      <TablesNavItem {table} />
    {/each}
  </Accordion.Root>
</nav>
