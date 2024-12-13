<script lang="ts">
  import Playground from "$lib/components/blocks/playground/playground.svelte"
  import type { PageData } from "./$types"

  type Props = {
    data: PageData
  }

  let { data }: Props = $props()

  let isLoggedIn = $derived(!!data.me)
</script>

<Playground {isLoggedIn} />
