<script lang="ts">
  import { page } from "$app/stores"
  import ShareViewPage from "$lib/components/blocks/share/share-view-page.svelte"
  import { shareStore } from "$lib/store/share.store"
  import { onMount, type ComponentType } from "svelte"
  import { derived } from "svelte/store"
  import { r } from "$lib/store/records.store"

  let RecordDetailSheet: ComponentType

  onMount(async () => {
    RecordDetailSheet = (await import("$lib/components/blocks/record-detail/share-record-detail-sheet.svelte")).default
  })

  const viewId = derived([shareStore, page], ([$shareStore, $page]) => {
    const share = $shareStore.get($page.params.shareId)
    return share?.target.id!
  })
</script>

<ShareViewPage {viewId} shareId={$page.params.shareId} />

{#if RecordDetailSheet}
  <RecordDetailSheet {viewId} readonly {r} />
{/if}
