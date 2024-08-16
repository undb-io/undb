<script lang="ts">
  import { goto, invalidateAll } from "$app/navigation"
  import Button from "$lib/components/ui/button/button.svelte"
  import * as Dialog from "$lib/components/ui/dialog"
  import { closeModal, DUPLICATE_BASE_MODAL, isModalOpen } from "$lib/store/modal.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import type { Base, IBaseDTO } from "@undb/base"
  import { LoaderCircleIcon } from "lucide-svelte"
  import { toast } from "svelte-sonner"

  export let base: Omit<IBaseDTO, "spaceId">

  const duplicateBaseMutation = createMutation({
    mutationFn: trpc.base.duplicate.mutate,
    onSuccess: async (data) => {
      await invalidateAll()
      closeModal(DUPLICATE_BASE_MODAL)
      await goto(`/bases/${data}`)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
</script>

<Dialog.Root
  open={$isModalOpen(DUPLICATE_BASE_MODAL)}
  onOpenChange={(open) => {
    if (!open) {
      closeModal(DUPLICATE_BASE_MODAL)
    }
  }}
>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Duplicate Base {base.name}</Dialog.Title>
      <Dialog.Description>Create a new base include all tables in base.</Dialog.Description>
    </Dialog.Header>

    <div class="item-center flex justify-end gap-2">
      <Button
        on:click={() => {
          closeModal(DUPLICATE_BASE_MODAL)
        }}
        variant="outline"
      >
        Cancel
      </Button>
      <Button
        disabled={$duplicateBaseMutation.isPending}
        on:click={() => {
          $duplicateBaseMutation.mutate({ id: base.id })
        }}
      >
        {#if $duplicateBaseMutation.isPending}
          <LoaderCircleIcon class="mr-2 h-5 w-5 animate-spin" />
        {/if}
        Duplicate
      </Button>
    </div>
  </Dialog.Content>
</Dialog.Root>
