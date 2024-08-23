<script lang="ts">
  import BaseSetting from "$lib/components/blocks/base/base-setting.svelte"
  import type { PageData } from "../$types"

  export let data: PageData
  let store = data.getBaseStore

  let base = $store.data?.base
</script>

{#if base}
  <BaseSetting {base} />
{/if}
