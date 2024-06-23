<script lang="ts">
  import { page } from "$app/stores"
  import { type GetIndexQuery$result } from "$houdini"
  import * as Accordion from "$lib/components/ui/accordion"
  import { EllipsisIcon, HardDriveIcon, PlusIcon } from "lucide-svelte"
  import TablesNavItem from "./tables-nav-item.svelte"
  import { CREATE_TABLE_MODAL, toggleModal } from "$lib/store/modal.store"

  export let tables: GetIndexQuery$result["tables"] = []
  export let bases: GetIndexQuery$result["bases"] = []

  let el: HTMLElement
  $: tables, el?.querySelector('[data-active="true"]')?.scrollIntoView()

  $: tableId = $page.params.tableId

  $: tablesWithoutBase = tables.filter((t) => !t?.baseId)
</script>

<nav bind:this={el} class="grid items-start px-2 text-sm font-medium lg:px-4">
  <Accordion.Root value={tableId}>
    {#if bases}
      {#each bases as base}
        {@const baseTables = tables.filter((t) => t?.baseId === base?.id)}
        {#if base}
          <div
            data-base-id={base.id}
            class="text-muted-foreground group flex items-center justify-between gap-3 px-3 py-2"
          >
            <span class="flex items-center gap-3">
              <HardDriveIcon class="h-4 w-4" />
              {base.name}
            </span>
            <span class="hidden items-center gap-1 group-hover:flex">
              <EllipsisIcon class="h-4 w-4" />
              <button on:click={() => toggleModal(CREATE_TABLE_MODAL)}>
                <PlusIcon class="h-4 w-4" />
              </button>
            </span>
          </div>
          {#each baseTables as table}
            <div class="pl-2">
              <TablesNavItem {table} />
            </div>
          {/each}
        {/if}
      {/each}
    {/if}
    {#each tablesWithoutBase as table}
      <TablesNavItem {table} />
    {/each}
  </Accordion.Root>
</nav>
