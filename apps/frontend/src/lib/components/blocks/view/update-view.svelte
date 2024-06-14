<script lang="ts">
  import { getTable, viewId } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { updateViewCommand } from "@undb/commands"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import * as Form from "$lib/components/ui/form"
  import { Input } from "$lib/components/ui/input"
  import { toggleModal, UPDATE_VIEW } from "$lib/store/modal.store"

  const table = getTable()

  const updateViewMutation = createMutation({
    mutationKey: ["table", $viewId, "updateView"],
    mutationFn: trpc.table.view.update.mutate,
    onSuccess(data, variables, context) {
      toggleModal(UPDATE_VIEW)
    },
  })

  const view = $table.views.getViewById($viewId)

  const form = superForm(
    defaults(
      {
        tableId: $table.id.value,
        viewId: $viewId,
        name: view.name.value,
      },
      zodClient(updateViewCommand),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zodClient(updateViewCommand),
      resetForm: false,
      invalidateAll: true,
      onUpdate(event) {
        if (!event.form.valid) return

        $updateViewMutation.mutate(event.form.data)
      },
    },
  )
  const { enhance, form: formData } = form
</script>

<div>
  <form method="POST" use:enhance>
    <Form.Field {form} name="name">
      <Form.Control let:attrs>
        <Form.Label>Name</Form.Label>
        <Input autofocus {...attrs} bind:value={$formData.name} />
      </Form.Control>
      <Form.Description />
      <Form.FieldErrors />
    </Form.Field>

    <Form.FormButton class="w-full">Submit</Form.FormButton>
  </form>
</div>
