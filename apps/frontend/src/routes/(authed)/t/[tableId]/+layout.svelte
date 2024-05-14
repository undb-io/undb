<script lang="ts">
  import { page } from "$app/stores"
  import { tableCreator } from "@undb/table"
  import { setTable } from "$lib/store/table.store"
  import type { LayoutData } from "./$types"
  import { writable } from "svelte/store"

  export let data: LayoutData

  const table = writable(tableCreator.fromJSON(data.table))
  $: {
    if ($page.params.tableId === $table.id.value) {
      table.set(tableCreator.fromJSON(data.table))
      setTable(table)
    }
  }
</script>

<main class="flex flex-1 flex-col gap-4 px-4 py-2 lg:gap-6 lg:px-6 lg:py-4">
  <slot />
</main>
