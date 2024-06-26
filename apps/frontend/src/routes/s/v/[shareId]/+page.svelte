<script lang="ts">
  import { page } from "$app/stores"
  import GridView from "$lib/components/blocks/grid-view/grid-view.svelte"
  import { shareStore } from "$lib/store/share.store"
  import { onMount, type ComponentType } from "svelte"
  import { derived } from "svelte/store"

  let RecordDetailSheet: ComponentType

  onMount(async () => {
    RecordDetailSheet = (await import("$lib/components/blocks/record-detail/record-detail-sheet.svelte")).default
  })

  const viewId = derived([shareStore, page], ([$shareStore, $page]) => {
    const share = $shareStore.get($page.params.shareId)
    return share?.target.id!
  })
</script>

<GridView readonly {viewId} />

{#if RecordDetailSheet}
  <RecordDetailSheet readonly />
{/if}
