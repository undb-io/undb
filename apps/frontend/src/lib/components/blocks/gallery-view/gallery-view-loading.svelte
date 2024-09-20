<script lang="ts">
  import { Skeleton } from "$lib/components/ui/skeleton"
</script>

<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  {#each Array(12) as _}
    <div class="flex flex-col rounded-md border shadow-sm">
      <Skeleton class="h-[150px] w-full" />
      <div class="flex flex-col space-y-2 p-4">
        <Skeleton class="h-4 w-3/4" />
        <Skeleton class="h-4 w-1/2" />
        <Skeleton class="h-4 w-2/3" />
      </div>
    </div>
  {/each}
</div>
