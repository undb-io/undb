<script lang="ts">
  import { CREATE_DASHBOARD_MODAL, CREATE_TABLE_MODAL, IMPORT_TABLE_MODAL, openModal } from "$lib/store/modal.store"
  import {
    DatabaseIcon,
    ImportIcon,
    PlusCircleIcon,
    PlusIcon,
    SquareMousePointer,
    LayoutDashboardIcon,
    GaugeIcon,
  } from "lucide-svelte"
  import * as Table from "$lib/components/ui/table"
  import { goto } from "$app/navigation"
  import { hasPermission } from "$lib/store/space-member.store"
  import type { IBaseOption } from "@undb/base"
  import { baseId } from "$lib/store/base.store"
  import { Button } from "$lib/components/ui/button"

  export let base: {
    id: string
    name: string
    option: IBaseOption | null
    tables: ({
      id: string
      name: string
    } | null)[]
    dashboards: ({
      id: string
      name: string
      description: string | null | undefined
    } | null)[]
  }

  export let getTableUrl: (tableId: string) => string
</script>

<main class="flex flex-1 flex-col overflow-hidden px-4 py-4">
  <div class="flex items-center gap-4">
    {#if $hasPermission("table:create")}
      <button
        type="button"
        class="flex h-32 w-80 flex-col justify-between rounded-lg border bg-neutral-50 px-4 py-7 text-left transition-all hover:bg-neutral-100/70 hover:shadow-md"
        on:click={() => {
          baseId.set(base.id)
          openModal(CREATE_TABLE_MODAL)
        }}
      >
        <PlusCircleIcon class="text-blue-600" />

        Create New Table
      </button>
      <button
        type="button"
        class="flex h-32 w-80 flex-col justify-between rounded-lg border bg-neutral-50 px-4 py-7 text-left transition-all hover:bg-neutral-100/70 hover:shadow-md"
        on:click={() => {
          baseId.set(base.id)
          openModal(IMPORT_TABLE_MODAL)
        }}
      >
        <ImportIcon class="text-orange-600" />

        Import Table
      </button>
    {/if}
    {#if $hasPermission("dashboard:create")}
      <button
        type="button"
        class="flex h-32 w-80 flex-col justify-between rounded-lg border bg-neutral-50 px-4 py-7 text-left transition-all hover:bg-neutral-100/70 hover:shadow-md"
        on:click={() => {
          baseId.set(base.id)
          openModal(CREATE_DASHBOARD_MODAL)
        }}
      >
        <LayoutDashboardIcon class="text-green-600" />

        Create New Dashboard
      </button>
    {/if}
  </div>

  <section class="flex flex-1 flex-col overflow-hidden pt-3">
    {#if base.dashboards.length > 0}
      <h3 class="mt-2 text-xl font-semibold tracking-tight">Dashboards</h3>

      <div class="mt-4 flex flex-wrap gap-2 overflow-y-auto">
        {#each base.dashboards as dashboard}
          {#if dashboard}
            <a
              href={`/dashboards/${dashboard.id}`}
              class="text-card-foreground h-[100px] w-[300px] overflow-hidden rounded-md border px-4 py-2 transition-all hover:shadow-md"
            >
              <span class="inline-flex items-center font-semibold">
                <GaugeIcon class="mr-2 h-4 w-4" />
                {dashboard.name}
              </span>
              {#if dashboard.description}
                <p class="text-muted-foreground truncate text-sm">{dashboard.description}</p>
              {/if}
            </a>
          {/if}
        {/each}
      </div>
    {/if}

    <h3 class="mt-2 text-xl font-semibold tracking-tight">Tables</h3>

    <Table.Root class="flex w-full flex-1 flex-col overflow-y-auto">
      <Table.Header class="flex w-full">
        <Table.Row class="w-full">
          <Table.Head>Name</Table.Head>
        </Table.Row>
      </Table.Header>
      {#if base.tables.length > 0}
        <Table.Body class="w-full flex-1">
          {#each base.tables as table}
            {#if table}
              <Table.Row class="flex w-full cursor-pointer" on:click={() => goto(getTableUrl(table.id))}>
                <Table.Cell class="flex items-center font-medium text-gray-700">
                  <DatabaseIcon class="mr-2 h-4 w-4" />
                  {table.name}
                </Table.Cell>
              </Table.Row>
            {/if}
          {/each}
        </Table.Body>
      {:else}
        <div class="flex flex-1 items-center justify-center">
          <div class="text-muted-foreground">
            <div class="flex flex-col items-center gap-1 space-y-2 text-center">
              <SquareMousePointer class="text-primary h-10 w-10" />
              <h3 class="text-sm font-bold tracking-tight">{base.name} have no tables</h3>
              {#if $hasPermission("table:create")}
                <p class="text-muted-foreground text-sm">You can create or import table to start</p>
                <Button
                  class="w-48"
                  on:click={() => {
                    baseId.set(base.id)
                    openModal(CREATE_TABLE_MODAL)
                  }}
                >
                  <PlusIcon class="mr-2 h-4 w-4" />
                  Create New Table
                </Button>
                <Button
                  class="w-48"
                  variant="outline"
                  on:click={() => {
                    baseId.set(base.id)
                    openModal(IMPORT_TABLE_MODAL)
                  }}
                >
                  <ImportIcon class="mr-2 h-4 w-4" />
                  Import Table
                </Button>
              {/if}
            </div>
          </div>
        </div>
      {/if}
    </Table.Root>
  </section>
</main>
