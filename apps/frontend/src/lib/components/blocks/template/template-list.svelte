<script lang="ts">
  import type { ITemplateDTO } from "@undb/template"
  import { trpc } from "$lib/trpc/client"
  import { createQuery } from "@tanstack/svelte-query"
  import TemplateCard from "./template-card.svelte"

  const getTemplates = createQuery({
    queryKey: ["templates"],
    queryFn: trpc.template.list.query,
  })

  $: templates = ($getTemplates.data ?? []) as ITemplateDTO[]
</script>

<div class="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
  {#if $getTemplates.isLoading}
    {#each Array(40) as _}
      <div class="animate-pulse space-y-2 rounded-sm bg-gray-100 p-5">
        <div class="h-6 w-3/4 rounded bg-gray-200"></div>
        <div class="h-10 w-full rounded bg-gray-200"></div>
      </div>
    {/each}
  {:else}
    {#each templates as template}
      <TemplateCard {template} />
    {/each}
  {/if}
</div>
