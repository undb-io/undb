<script lang="ts">
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { updateBaseCommand } from "@undb/commands"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import * as Form from "$lib/components/ui/form"
  import { Input } from "$lib/components/ui/input"
  import { toggleModal, UPDATE_BASE_MODAL } from "$lib/store/modal.store"
  import type { GetBaseQuery$result } from "$houdini"

  export let base: GetBaseQuery$result["base"]

  const updateBaseMutation = createMutation({
    mutationKey: ["base", base.id, "updateBase"],
    mutationFn: trpc.base.update.mutate,
    onSuccess(data, variables, context) {
      toggleModal(UPDATE_BASE_MODAL)
    },
  })

  const form = superForm(
    defaults(
      {
        id: base.id,
        name: base.name,
      },
      zodClient(updateBaseCommand),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zodClient(updateBaseCommand),
      resetForm: false,
      invalidateAll: true,
      onUpdate(event) {
        if (!event.form.valid) return

        $updateBaseMutation.mutate(event.form.data)
      },
    },
  )
  const { enhance, form: formData } = form
</script>

<div>
  <form class="space-y-4" method="POST" use:enhance>
    <Form.Field {form} name="name">
      <Form.Control let:attrs>
        <Form.Label>Name</Form.Label>
        <Input autofocus {...attrs} bind:value={$formData.name} placeholder="base name" />
      </Form.Control>
      <Form.Description />
      <Form.FieldErrors />
    </Form.Field>

    <Form.FormButton class="w-full">Submit</Form.FormButton>
  </form>
</div>
