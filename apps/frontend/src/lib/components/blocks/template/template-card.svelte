<script lang="ts">
  import type { ITemplateDTO } from "@undb/template"
  import * as Card from "$lib/components/ui/card"
  import { Button } from "$lib/components/ui/button"
  import { createMutation } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { toast } from "svelte-sonner"
  import { invalidateAll, goto } from "$app/navigation"
  import { IMPORT_TEMPLATE_MODAL, closeModal } from "$lib/store/modal.store"
  import { LoaderCircleIcon } from "lucide-svelte"

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

<Card.Root class="space-y-2 rounded-sm p-5">
  <Card.Header class="p-0">
    <Card.Title>{template.name}</Card.Title>
    <!-- <Card.Description>{template.description}</Card.Description> -->
  </Card.Header>
  <!-- <Card.Content class="p-0">
    <p>Card Content</p>
  </Card.Content> -->
  <Card.Footer class="p-0">
    <Button
      variant="outline"
      class="w-full"
      disabled={$createFromTemplate.isPending}
      on:click={() => $createFromTemplate.mutate({ id: template.id })}
    >
      {#if $createFromTemplate.isPending}
        <LoaderCircleIcon class="mr-2 h-3 w-3 animate-spin" />
      {/if}
      Import Template</Button
    >
  </Card.Footer>
</Card.Root>
