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

<main class="flex flex-1 flex-col">
  <slot />
</main>
