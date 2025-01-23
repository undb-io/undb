<script lang="ts">
  import BaseHeader from "$lib/components/blocks/base/base-header.svelte"
  import UpdateBaseDialog from "$lib/components/blocks/base/update-base-dialog.svelte"
  import { shareStore } from "$lib/store/share.store.svelte"
  import type { LayoutData } from "./$types"

  export let data: LayoutData

  $: getBaseStore = data.getBaseStore
  $: base = $getBaseStore.data?.base
  $: share = base?.share

  $: if (share && base) {
    shareStore.set(base.id, { enabled: share.enabled, id: share.id, target: { type: "base", id: base.id } })
  }
</script>

<main class="flex h-screen flex-col">
  {#if base}
    <BaseHeader {base} />
    <UpdateBaseDialog {base} />
    <slot />
  {/if}
</main>
