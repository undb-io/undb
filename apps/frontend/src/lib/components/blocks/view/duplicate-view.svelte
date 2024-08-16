<script lang="ts">
  import { getTable, viewId } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { duplicateViewCommand } from "@undb/commands"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import * as Form from "$lib/components/ui/form"
  import { Input } from "$lib/components/ui/input"
  import { toggleModal, DUPLICATE_VIEW } from "$lib/store/modal.store"
  import { getNextName } from "@undb/utils"

  const table = getTable()

  const duplicateViewMutation = createMutation({
    mutationKey: ["table", $viewId, "duplicateView"],
    mutationFn: trpc.table.view.duplicate.mutate,
    onSuccess(data, variables, context) {
      toggleModal(DUPLICATE_VIEW)
    },
  })

  const view = $table.views.getViewById($viewId)

  const form = superForm(
    defaults(
      {
        tableId: $table.id.value,
        viewId: $viewId,
        name: getNextName(
          $table.views.views.map((view) => view.name.value),
          `${view.name.value} Copy`,
        ),
      },
      zodClient(duplicateViewCommand),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zodClient(duplicateViewCommand),
      resetForm: false,
      invalidateAll: true,
      onUpdate(event) {
        if (!event.form.valid) return

        $duplicateViewMutation.mutate(event.form.data)
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
