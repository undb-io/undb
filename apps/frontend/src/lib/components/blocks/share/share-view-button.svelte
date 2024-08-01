<script lang="ts">
  import { page } from "$app/stores"
  import { getTable } from "$lib/store/table.store"
  import { derived } from "svelte/store"
  import ShareButton from "./share-button.svelte"

  const t = getTable()
  const viewId = derived([page, t], ([$page, $table]) => $page.params.viewId ?? $table.views.getDefaultView().id.value)
</script>

<ShareButton type="view" id={$viewId} />
