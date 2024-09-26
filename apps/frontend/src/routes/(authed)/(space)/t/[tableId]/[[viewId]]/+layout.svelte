<script lang="ts">
  import { onMount } from "svelte"
  import { lastViewedTable } from "$lib/store/persisted.store"
  import { derived } from "svelte/store"
  import { page } from "$app/stores"
  import { currentSpaceId } from "$lib/store/space.store"

  let tableId = derived([page], ([$page]) => $page.params.tableId)
  let viewId = derived([page], ([$page]) => $page.params.viewId)

  $: if ($currentSpaceId) {
    lastViewedTable.update((l) => ({
      ...l,
      [$currentSpaceId]: {
        tableId: $tableId,
        viewId: $viewId,
      },
    }))
  }
</script>

<slot />
