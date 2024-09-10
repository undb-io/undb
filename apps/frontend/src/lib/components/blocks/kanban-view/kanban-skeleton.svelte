<script lang="ts">
  import { Skeleton } from "$lib/components/ui/skeleton"
</script>

<div class="flex-1 overflow-x-auto overflow-y-hidden">
  <div class="w-full overflow-hidden">
    {#each Array(4) as _, i}
      <div class="mb-2 w-full rounded bg-white p-2 shadow">
        <Skeleton class="mb-2 h-4 w-full" />
        <Skeleton class="h-3 w-16" />
      </div>
    {/each}
  </div>
</div>
