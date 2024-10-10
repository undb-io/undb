<script lang="ts">
  import { AspectRatio } from "$lib/components/ui/aspect-ratio"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { cn } from "$lib/utils"
  import { createQuery } from "@tanstack/svelte-query"

  const table = getTable()
  export let viewId: string | undefined

  const getAggregate = createQuery({
    queryKey: ["aggregate"],
  })
</script>

<AspectRatio ratio={1}>
  <div class={cn("flex h-full w-full items-center justify-center rounded-lg bg-white p-6", $$restProps.class)}>
    <span class="text-8xl font-bold">50</span>
  </div>
</AspectRatio>
