<script lang="ts">
  import type { ITemplateDTO } from "@undb/template"
  import * as Card from "$lib/components/ui/card"
  import { Button } from "$lib/components/ui/button"
  import { createMutation } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { toast } from "svelte-sonner"
  import { invalidateAll, goto } from "$app/navigation"
  import { IMPORT_TEMPLATE_MODAL, closeModal } from "$lib/store/modal.store"
  import { LoaderCircleIcon, FullscreenIcon } from "lucide-svelte"

  export let template: ITemplateDTO

  const createFromTemplate = createMutation({
    mutationFn: trpc.template.createFromTemplate.mutate,
    async onSuccess(data, variables, context) {
      toast.success("Base created successfully")
      closeModal(IMPORT_TEMPLATE_MODAL)
      await invalidateAll()
      if (data.baseIds.length > 0) {
        goto(`/bases/${data.baseIds[0]}`)
      }
    },
    onError(error) {
      toast.error(error.message)
    },
  })
</script>

<Card.Root class="group flex h-[180px] flex-col justify-between space-y-2 rounded-sm p-5">
  <Card.Header class="p-0">
    <Card.Title class="flex gap-2">
      <span class="-translate-y-1 self-start justify-self-start text-xl">{template.icon}</span>
      <div class="flex flex-col gap-2">
        <span>
          {template.name}
        </span>
        <span class="text-muted-foreground text-xs"># {template.category}</span>
      </div>
    </Card.Title>
    <Card.Description class="line-clamp-2" title={template.description}>
      {template.description}
    </Card.Description>
  </Card.Header>
  <!-- <Card.Content class="p-0">
    <p>Card Content</p>
  </Card.Content> -->
  <Card.Footer class="p-0">
    <Button
      variant="outline"
      class="w-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      size="sm"
      disabled={$createFromTemplate.isPending}
      on:click={() => $createFromTemplate.mutate({ id: template.id })}
    >
      {#if $createFromTemplate.isPending}
        <LoaderCircleIcon class="mr-2 size-4 animate-spin" />
      {:else}
        <FullscreenIcon class="mr-2 size-4" />
      {/if}
      Import Template
    </Button>
  </Card.Footer>
</Card.Root>
