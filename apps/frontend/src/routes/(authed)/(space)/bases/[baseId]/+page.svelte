<script lang="ts">
  import BaseDetail from "$lib/components/blocks/base/base-detail.svelte"
  import type { PageData } from "./$types"

  export let data: PageData

  let getBaseStore = data.getBaseStore
  $: base = $getBaseStore.data?.base
</script>

{#if base}
  <BaseDetail {base} getTableUrl={(tableId) => `/t/${tableId}`} />
{/if}
