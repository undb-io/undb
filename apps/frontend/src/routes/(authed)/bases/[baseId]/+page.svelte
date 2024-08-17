<script lang="ts">
  import BaseDetail from "$lib/components/blocks/base/base-detail.svelte"
  import UpdateBaseDialog from "$lib/components/blocks/base/update-base-dialog.svelte"
  import type { PageData } from "./$types"

  export let data: PageData

  $: getBaseStore = data.getBaseStore
  $: base = $getBaseStore.data?.base
</script>

{#if base}
  <BaseDetail {base} />
  <UpdateBaseDialog {base} />
{/if}
