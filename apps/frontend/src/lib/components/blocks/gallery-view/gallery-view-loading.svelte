<script lang="ts">
  import { Skeleton } from "$lib/components/ui/skeleton"
  import { getTable } from "$lib/store/table.store"
  import type { Readable } from "svelte/store"

  const table = getTable()
  export let viewId: Readable<string | undefined>

  $: fields = $table.getOrderedVisibleFields($viewId) ?? []
</script>

<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
  {#each Array(20) as _}
    <div class="flex flex-col rounded-md border shadow-sm">
      <Skeleton class="h-[150px] w-full" />
      <div class="flex flex-col space-y-2 px-2 py-4">
        {#each Array(fields.length - 1) as _}
          <Skeleton class="h-5 w-full" />
        {/each}
      </div>
    </div>
  {/each}
</div>
