<script lang="ts">
  import { TableFactory, TableDo } from "@undb/table"
  import { setTable } from "$lib/store/table.store"
  import type { LayoutData } from "./$types"
  import { writable } from "svelte/store"
  import { shareStore } from "$lib/store/share.store.svelte"
  import Logo from "$lib/images/logo.svg"

  export let data: LayoutData
  $: tableStore = data.getFormShareData

  $: fetching = $tableStore.fetching
  $: tableDTO = $tableStore.data?.tableByShare
  $: share = $tableStore.data?.share

  const table = writable<TableDo>()
  $: {
    if (!fetching && tableDTO) {
      table.set(new TableFactory().fromJSON(tableDTO))
      setTable(table)
    }
  }

  $: if (share) {
    $shareStore.set(share.id, share)
  }
</script>

{#if $table}
  <main class="relative h-full w-full">
    <slot />
    <div class="text-muted-foreground absolute bottom-5 right-5 flex items-center justify-center text-sm">
      <img src={Logo} alt="undb" class="mr-2 h-4 w-4" />
      Powered by <a href="https://undb.io" class="text-primary underline">&nbsp;undb</a>
    </div>
  </main>
{/if}

<style>
  :global(html) {
    height: 100vh;
  }
  :global(body) {
    height: 100vh;
  }
</style>
