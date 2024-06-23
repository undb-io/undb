<script lang="ts">
  import type { GetBaseQuery$result } from "$houdini"
  import { HardDriveIcon } from "lucide-svelte"

  export let base: GetBaseQuery$result["base"]
</script>

<header class="flex h-12 items-center border-b px-4 py-3">
  {#if base}
    <div class="flex items-center gap-2">
      <HardDriveIcon class="h-4 w-4" />
      {base.name}
    </div>
  {/if}
</header>
