<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import { createMutation } from "@tanstack/svelte-query"
  import { updateViewCommand } from "@undb/commands"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import * as Form from "$lib/components/ui/form"
  import { Input } from "$lib/components/ui/input"
  import { toggleModal, UPDATE_VIEW } from "$lib/store/modal.store"
  import { toast } from "svelte-sonner"
  import type { Readable } from "svelte/store"
  import { invalidate } from "$app/navigation"
  import { LL } from "@undb/i18n/client"
  import { getDataService } from "$lib/store/data-service.store"

  const table = getTable()
  export let viewId: Readable<string | undefined>

  const dataService = getDataService()

  const updateViewMutation = createMutation({
    mutationKey: ["table", $viewId, "updateView"],
    mutationFn: dataService.table.view.updateView,
    async onSuccess(data, variables, context) {
      toggleModal(UPDATE_VIEW)
      toast.success($LL.table.view.updated())
      await invalidate(`undb:table:${$table.id.value}`)
    },
    onError(error, variables, context) {
      toast.error(error.message)
    },
  })

  const view = $table.views.getViewById($viewId)

  const form = superForm(
    defaults(
      {
        tableId: $table.id.value,
        viewId: $viewId,
        type: view.type,
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
        if (!event.form.valid) {
          console.log(event.form.errors)
          return
        }

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
        <Form.Label>{$LL.common.name()}</Form.Label>
        <Input autofocus {...attrs} bind:value={$formData.name} />
      </Form.Control>
      <Form.Description />
      <Form.FieldErrors />
    </Form.Field>

    <Form.FormButton disabled={$updateViewMutation.isPending} class="w-full">{$LL.common.submit()}</Form.FormButton>
  </form>
</div>
