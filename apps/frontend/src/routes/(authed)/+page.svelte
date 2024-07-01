<script lang="ts">
  import EmptyBase from "$lib/components/blocks/base/empty-base.svelte"
  import type { PageData } from "./$types"

  export let data: PageData
  $: indexDataStore = data.indexDataStore
  $: bases = $indexDataStore.data?.bases?.filter(Boolean) ?? []
</script>

{#if !bases.length}
  <EmptyBase />
{:else}
  <slot />
{/if}
