<script lang="ts">
  import BaseHeader from "$lib/components/blocks/base/base-header.svelte"
  import UpdateBaseDialog from "$lib/components/blocks/base/update-base-dialog.svelte"
  import type { LayoutData } from "./$types"

  export let data: LayoutData

  $: getBaseStore = data.getBaseStore
  $: base = $getBaseStore.data?.base
</script>

<main class="flex flex-col">
  {#if base}
    <BaseHeader {base} />
    <UpdateBaseDialog {base} />
    <slot />
  {/if}
</main>
