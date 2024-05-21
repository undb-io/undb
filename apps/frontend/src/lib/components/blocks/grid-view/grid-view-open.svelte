<script lang="ts">
  import { Maximize2Icon } from "lucide-svelte"
  import { queryParam, ssp } from "sveltekit-search-params"

  const r = queryParam("r", ssp.string(), { pushHistory: false })
  export let recordId: string
</script>

<button
  on:click={() => r.set(recordId)}
  class="text-muted-foreground hidden h-full w-full items-center justify-center font-normal transition-opacity duration-100 group-hover:flex"
>
  <Maximize2Icon class="h-4 w-3" />
</button>
