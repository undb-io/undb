<script lang="ts">
  import { goto, invalidateAll } from "$app/navigation"
  import Button from "$lib/components/ui/button/button.svelte"
  import * as Dialog from "$lib/components/ui/dialog"
  import { closeModal, DUPLICATE_BASE_MODAL, isModalOpen } from "$lib/store/modal.store"
  import * as Form from "$lib/components/ui/form"
  import { Input } from "$lib/components/ui/input"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import type { Base, IBaseDTO } from "@undb/base"
  import { duplicateBaseCommand } from "@undb/commands"
  import { LoaderCircleIcon, SirenIcon } from "lucide-svelte"
  import { toast } from "svelte-sonner"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import { Checkbox } from "$lib/components/ui/checkbox"
  import * as Alert from "$lib/components/ui/alert"

  export let base: Omit<IBaseDTO, "spaceId">

  const form = superForm(
    defaults(
      {
        id: base.id,
        name: "",
        includeData: true,
      },
      zodClient(duplicateBaseCommand),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zodClient(duplicateBaseCommand),
      resetForm: false,
      invalidateAll: false,
      onUpdate(event) {
        if (!event.form.valid) {
          return
        }

        $duplicateBaseMutation.mutate(event.form.data)
      },
    },
  )

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

  const { form: formData, enhance } = form
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

    <form method="POST" use:enhance class="space-y-4">
      <Form.Field {form} name="name">
        <Form.Control let:attrs>
          <Form.Label>Name</Form.Label>
          <Input {...attrs} bind:value={$formData.name} />
        </Form.Control>
        <Form.Description>This is base display name.</Form.Description>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="includeData" class="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
        <Form.Control let:attrs>
          <Checkbox {...attrs} bind:checked={$formData.includeData} />
          <div class="space-y-1 leading-none">
            <Form.Label>Include data</Form.Label>
            <Form.Description>Include data in the new base.</Form.Description>
          </div>
          <input name={attrs.name} value={$formData.includeData} hidden />
        </Form.Control>
      </Form.Field>

      <Alert.Root>
        <Alert.Description class="flex items-center text-xs">
          <SirenIcon class="mr-2 h-4 w-4" />
          System fields will be updated to the current user and timestamp.
        </Alert.Description>
      </Alert.Root>

      <div class=" flex items-center justify-end gap-2">
        <Button
          on:click={() => {
            closeModal(DUPLICATE_BASE_MODAL)
          }}
          variant="outline"
        >
          Cancel
        </Button>
        <Form.Button
          disabled={$duplicateBaseMutation.isPending}
          on:click={() => {
            $duplicateBaseMutation.mutate({ id: base.id })
          }}
        >
          {#if $duplicateBaseMutation.isPending}
            <LoaderCircleIcon class="mr-2 h-5 w-5 animate-spin" />
          {/if}
          Duplicate
        </Form.Button>
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>
