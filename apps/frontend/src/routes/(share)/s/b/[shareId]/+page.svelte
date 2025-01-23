<script lang="ts">
  import { page } from "$app/stores"
  import BaseDetail from "$lib/components/blocks/base/base-detail.svelte"
  import type { PageData } from "./$types"
  import { setShareId } from "$lib/store/share.store.svelte"

  export let data: PageData

  $: getBaseStore = data.getShareBaseStore
  $: base = $getBaseStore.data?.baseByShare
  $: shareId = $page.params.shareId

  $: if (shareId) {
    setShareId(shareId)
  }
</script>

{#if base}
  <BaseDetail {base} getTableUrl={(tableId) => `/s/b/${shareId}/t/${tableId}`} />
{/if}
