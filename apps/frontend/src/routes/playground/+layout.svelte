<script lang="ts">
  import { setIsLocal } from "$lib/store/data-service.store"
  import { setIsPlayground } from "$lib/store/playground.svelte"

  setIsLocal(true)
  setIsPlayground(true)
</script>

<slot />
