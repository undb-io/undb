<script lang="ts">
  import { MoveLeftIcon } from "lucide-svelte"
  import type { PageServerData } from "./$types"
  import { Button } from "$lib/components/ui/button"
  import { AspectRatio } from "$lib/components/ui/aspect-ratio"
  import * as Dialog from "$lib/components/ui/dialog"

  export let data: PageServerData

  let template = data.template
</script>

<svelte:head>
  <title>{template?.values.Title} | Undb Templates</title>
</svelte:head>

<section class="space-y-6 py-10">
  <div class="space-y-4">
    {#if template}
      <div class="flex items-center justify-between">
        <a href="/" class="text-muted-foreground hover:text-primary inline-flex items-center">
          <MoveLeftIcon class="mr-2 h-3 w-3" />
          Back to templates
        </a>
      </div>
      {@const cover = template.values.Cover?.[0]}
      {#if cover}
        <AspectRatio class="w-full" ratio={16 / 3}>
          <img class="h-full w-full object-cover" src={cover.signedUrl} alt={template.values.Title} />
        </AspectRatio>
      {/if}

      <h1 class="text-2xl font-semibold">{template.values.Title}</h1>

      {#if template.values.Images?.length}
        <div class="space-y-2">
          <h3 class="text-lg font-semibold">Images</h3>
          <div class="flex items-center gap-2">
            {#each template.values.Images ?? [] as image}
              <Dialog.Root>
                <Dialog.Trigger class="w-40">
                  <img src={image.signedUrl} alt={template.values.Title} />
                </Dialog.Trigger>
                <Dialog.Content class="p-2 md:max-w-7xl">
                  <img src={image.signedUrl} alt={template.values.Title} />
                </Dialog.Content>
              </Dialog.Root>
            {/each}
          </div>
        </div>
      {/if}

      <div class="space-y-2">
        <h3 class="text-lg font-semibold">Summary</h3>
        <p class="text-muted-foreground">
          {template.values.Summary}
        </p>
      </div>
    {/if}
  </div>

  {#if template}
    <div class="space-y-4">
      <h1 class="text-lg font-semibold">Template Preview</h1>
    </div>
  {/if}
</section>
