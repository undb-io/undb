<script lang="ts">
  import * as Form from "$lib/components/ui/form"
  import { trpc } from "$lib/trpc/client.js"
  import { createMutation } from "@tanstack/svelte-query"
  import { superForm, defaults } from "sveltekit-superforms"
  import { createBaseCommand } from "@undb/commands"
  import { zodClient } from "sveltekit-superforms/adapters"
  import { Input } from "$lib/components/ui/input"
  import { toast } from "svelte-sonner"
  import { CREATE_BASE_MODAL, closeModal } from "$lib/store/modal.store"
  import { goto } from "$app/navigation"
  import { page } from "$app/stores"

  const mutation = createMutation({
    mutationFn: trpc.base.create.mutate,
    async onSuccess(data) {
      closeModal(CREATE_BASE_MODAL)
      form.reset()
      await goto(`/${$page.params.spaceId}/bases/${data}`)
    },
    onError(error) {
      toast.error(error.message)
    },
  })

  const form = superForm(
    defaults(
      {
        name: "base",
        spaceId: $page.params.spaceId,
      },
      zodClient(createBaseCommand),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zodClient(createBaseCommand),
      resetForm: false,
      invalidateAll: true,
      onUpdate(event) {
        if (!event.form.valid) return

        $mutation.mutate(event.form.data)
      },
    },
  )

  const { form: formData, enhance } = form
</script>

<form id="createTable" class="space-y-2 px-1" method="POST" use:enhance>
  <Form.Field {form} name="name">
    <Form.Control let:attrs>
      <Form.Label>Name</Form.Label>
      <Input {...attrs} bind:value={$formData.name} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <div class="flex items-center justify-end gap-2">
    <Form.FormButton type="button" variant="secondary" on:click={() => closeModal(CREATE_BASE_MODAL)}>
      Cancel
    </Form.FormButton>
    <Form.FormButton>Create</Form.FormButton>
  </div>
</form>

<!-- <div class="mt-2">
  <SuperDebug data={$formData} />
</div> -->
