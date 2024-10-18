<script lang="ts">
  import { Skeleton } from "$lib/components/ui/skeleton"
  import { getTable } from "$lib/store/table.store"
  import type { Readable } from "svelte/store"
  const table = getTable()
  export let viewId: Readable<string | undefined>

  $: fields = $table.getOrderedVisibleFields($viewId) ?? []
</script>

<div class="flex w-full flex-col">
  <div class="flex items-center space-x-4 border-b px-4 py-3">
    {#each Array(Math.min(5, fields.length)) as _}
      <Skeleton class="h-6 w-24" />
    {/each}
  </div>
  {#each Array(20) as _}
    <div class="flex items-center space-x-4 border-b px-4 py-3">
      <Skeleton class="h-5 w-5 rounded-full" />
      {#each Array(Math.min(4, fields.length)) as _}
        <Skeleton class="h-4 flex-1" />
      {/each}
    </div>
  {/each}
</div>
