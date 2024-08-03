<script lang="ts">
  import type { GetBaseQuery$result } from "$houdini"
  import { CREATE_TABLE_MODAL, IMPORT_TABLE_MODAL, toggleModal } from "$lib/store/modal.store"
  import { DatabaseIcon, ImportIcon, PlusCircleIcon, PlusIcon } from "lucide-svelte"
  import * as Table from "$lib/components/ui/table"
  import { goto } from "$app/navigation"
  import { page } from "$app/stores"

  export let base: GetBaseQuery$result["base"]
</script>

<main class="h-full flex-1 px-4 py-4">
  <div class="flex items-center gap-4">
    <button
      type="button"
      class="flex h-32 w-80 flex-col justify-between rounded-lg bg-gray-100 px-4 py-7 text-left transition-all hover:bg-gray-200/50 hover:shadow-lg"
      on:click={() => {
        toggleModal(CREATE_TABLE_MODAL)
      }}
    >
      <PlusCircleIcon class="text-muted-foreground" />

      Create New Table
    </button>
    <button
      type="button"
      class="flex h-32 w-80 flex-col justify-between rounded-lg bg-gray-100 px-4 py-7 text-left transition-all hover:bg-gray-200/50 hover:shadow-lg"
      on:click={() => {
        toggleModal(IMPORT_TABLE_MODAL)
      }}
    >
      <ImportIcon class="text-muted-foreground" />

      Import Table
    </button>
  </div>

  <section class="pt-3">
    <h3 class="text-xl font-normal text-gray-600">Tables</h3>

    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.Head>Name</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {#each base.tables as table}
          {#if table}
            <Table.Row class="cursor-pointer" on:click={() => goto(`/${$page.params.spaceId}/t/${table.id}`)}>
              <Table.Cell class="flex items-center font-medium">
                <DatabaseIcon class="mr-2 h-4 w-4" />
                {table.name}
              </Table.Cell>
            </Table.Row>
          {/if}
        {/each}
      </Table.Body>
    </Table.Root>
  </section>
</main>
