<script lang="ts">
  import { page } from "$app/stores"
  import { type GetIndexQuery$result } from "$houdini"
  import * as Accordion from "$lib/components/ui/accordion"
  import { EllipsisIcon, HardDriveIcon, ImportIcon, PlusIcon } from "lucide-svelte"
  import TablesNavItem from "./tables-nav-item.svelte"
  import { CREATE_TABLE_MODAL, IMPORT_TABLE_MODAL, toggleModal } from "$lib/store/modal.store"
  import { baseId } from "$lib/store/base.store"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"

  export let tables: GetIndexQuery$result["tables"] = []
  export let bases: GetIndexQuery$result["bases"] = []

  let el: HTMLElement
  $: tables, el?.querySelector('[data-active="true"]')?.scrollIntoView()

  $: tableId = $page.params.tableId

  function onCreateBaseTable(id: string) {
    baseId.set(id)
    toggleModal(CREATE_TABLE_MODAL)
  }
</script>

<nav bind:this={el} class="grid items-start px-2 text-sm font-medium lg:px-4">
  <Accordion.Root value={tableId}>
    {#if bases}
      {#each bases as base}
        {@const baseTables = tables.filter((t) => t?.baseId === base?.id)}
        {@const active = base?.id === $page.params.baseId}
        {#if base}
          <div
            data-active={active}
            data-base-id={base.id}
            class="text-muted-foreground data-[active=true]:bg-muted data-[active=true]:text-muted-foreground group flex items-center justify-between gap-3 px-3 py-2"
          >
            <a class="flex w-full flex-1" href={`/bases/${base.id}`}>
              <span class="flex items-center gap-3">
                <HardDriveIcon class="h-4 w-4" />
                {base.name}
              </span>
            </a>
            <span class="items-center gap-2 opacity-0 group-hover:opacity-100">
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <EllipsisIcon class="h-4 w-4" />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content class="w-[200px]">
                  <DropdownMenu.Item on:click={() => toggleModal(IMPORT_TABLE_MODAL)}>
                    <ImportIcon class="text-muted-foreground mr-2 h-3 w-3" />
                    Import Data
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>

              <button
                type="button"
                on:click={(e) => {
                  // e.stopPropagation()
                  onCreateBaseTable(base.id)
                }}
              >
                <PlusIcon class="h-4 w-4" />
              </button>
            </span>
          </div>
          {#each baseTables as table}
            <div class="pl-4">
              <TablesNavItem {table} />
            </div>
          {/each}
        {/if}
      {/each}
    {/if}
  </Accordion.Root>
</nav>
