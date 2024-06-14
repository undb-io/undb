<script lang="ts">
  import { page } from "$app/stores"
  import { type GetIndexQuery$result } from "$houdini"
  import * as Accordion from "$lib/components/ui/accordion"
  import { Database, TableIcon } from "lucide-svelte"
  import { cn } from "$lib/utils"

  export let tables: GetIndexQuery$result["tables"] = []

  let el: HTMLElement
  $: tables, el?.querySelector('[data-active="true"]')?.scrollIntoView()

  $: tableId = $page.params.tableId
  $: viewId = $page.params.viewId
</script>

<nav bind:this={el} class="grid items-start px-2 text-sm font-medium lg:px-4">
  {#if tables}
    <Accordion.Root value={tableId}>
      {#each tables as table}
        {@const active = table.id === tableId && !viewId}
        {@const views = table.views.filter((v) => !v.isDefault)}
        <Accordion.Item value={table.id} class="w-full border-0">
          <Accordion.Trigger asChild class="w-full">
            <a
              href={`/t/${table.id}`}
              data-active={active}
              class="text-muted-foreground hover:text-primary data-[active=true]:bg-muted data-[active=true]:text-muted-foreground flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-all"
            >
              <Database class="h-4 w-4" />
              <span>
                {table.name}
              </span>
              <span
                class={cn("ml-auto text-xs font-normal", active ? "text-muted-foreground" : "text-muted-foreground")}
              >
                {table.recordsCount}
              </span>
            </a>
          </Accordion.Trigger>
          <Accordion.Content>
            {#each views as view}
              {@const activeView = view.id === viewId}
              <a
                href={`/t/${table.id}/${view.id}`}
                data-active={activeView}
                data-view-id={viewId}
                class="text-muted-foreground hover:bg-muted data-[active=true]:bg-muted data-[active=true]:text-muted-foreground my-1 flex w-full rounded-lg px-3 py-2 pl-8 transition-all"
              >
                <TableIcon class="mr-2 h-4 w-4" />
                <span class="text-xs">
                  {view.name}
                </span>
              </a>
            {/each}
          </Accordion.Content>
        </Accordion.Item>
      {/each}
    </Accordion.Root>
  {/if}
</nav>
