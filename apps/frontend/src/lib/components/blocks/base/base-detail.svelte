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
    CirclePlusIcon,
    ChevronDownIcon,
  } from "lucide-svelte"
  import * as Table from "$lib/components/ui/table"
  import { goto } from "$app/navigation"
  import { hasPermission } from "$lib/store/space-member.store"
  import type { IBaseOption } from "@undb/base"
  import { baseId } from "$lib/store/base.store"
  import { Button } from "$lib/components/ui/button"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import { LL } from "@undb/i18n/client"

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
  <section class="flex flex-1 flex-col overflow-hidden">
    <h3 class="mt-2 inline-flex items-center text-xl font-semibold tracking-tight">
      <GaugeIcon class="mr-2 size-5 text-gray-700" />
      {$LL.dashboard.dashboards()}
    </h3>

    <div class="mt-4 flex flex-wrap gap-2 overflow-y-auto">
      {#each base.dashboards as dashboard}
        {#if dashboard}
          <a
            href={`/dashboards/${dashboard.id}`}
            class="text-card-foreground h-[100px] w-[300px] overflow-hidden rounded-md border px-4 py-2 transition-all hover:shadow-md"
          >
            <span class="inline-flex items-center font-semibold">
              <GaugeIcon class="mr-2 h-4 w-4 text-gray-700" />
              {dashboard.name}
            </span>
            {#if dashboard.description}
              <p class="text-muted-foreground truncate text-sm">{dashboard.description}</p>
            {/if}
          </a>
        {/if}
      {/each}
      {#if $hasPermission("dashboard:create")}
        <button
          type="button"
          class="item-center group flex h-[100px] w-[300px] justify-center rounded-lg border border border-dashed transition-all hover:bg-neutral-50/70 hover:shadow-md"
          on:click={() => {
            baseId.set(base.id)
            openModal(CREATE_DASHBOARD_MODAL)
          }}
        >
          <div class="flex h-full w-full items-center justify-center">
            <CirclePlusIcon class="text-gray-300 transition-all group-hover:text-gray-700" />
          </div>
        </button>
      {/if}
    </div>

    <div class="mt-4 flex items-center gap-5">
      <h3 class="inline-flex items-center text-xl font-semibold tracking-tight">
        <DatabaseIcon class="mr-2 size-5 text-gray-700" />
        {$LL.table.common.tables()}
      </h3>

      {#if $hasPermission("table:create")}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild let:builder>
            <Button variant="outline" size="sm" builders={[builder]}>
              <PlusIcon class="mr-1 size-4" />
              {$LL.common.create()}
              <ChevronDownIcon class="ml-1 size-4" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content class="w-[200px]">
            <DropdownMenu.Group>
              <DropdownMenu.Item
                on:click={() => {
                  baseId.set(base.id)
                  openModal(CREATE_TABLE_MODAL)
                }}
                class="text-xs text-gray-700"
              >
                <PlusIcon class="mr-2 size-4" />
                {$LL.table.common.create()}
              </DropdownMenu.Item>

              <DropdownMenu.Item
                on:click={() => {
                  baseId.set(base.id)
                  openModal(IMPORT_TABLE_MODAL)
                }}
                class="text-xs text-gray-700"
              >
                <ImportIcon class="mr-2 size-4" />
                {$LL.table.common.import()}
              </DropdownMenu.Item>
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      {/if}
    </div>

    <Table.Root class="flex w-full flex-1 flex-col overflow-y-auto">
      <Table.Header class="flex w-full">
        <Table.Row class="w-full">
          <Table.Head>{$LL.common.name()}</Table.Head>
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
                  {$LL.table.common.create()}
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
                  {$LL.table.common.import()}
                </Button>
              {/if}
            </div>
          </div>
        </div>
      {/if}
    </Table.Root>
  </section>
</main>
