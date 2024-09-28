<script lang="ts">
  import { Maximize2Icon } from "lucide-svelte"
  import type { Writable } from "svelte/store"

  export let recordId: string
  export let r: Writable<string | null>
</script>

<button
  on:click={() => r.set(recordId)}
  class="text-muted-foreground hidden h-full w-full items-center justify-center font-normal transition-opacity duration-100 group-hover:flex"
>
  <Maximize2Icon class="h-4 w-3" />
</button>
