<script lang="ts">
  import * as Form from "$lib/components/ui/form"
  import { trpc } from "$lib/trpc/client.js"
  import { createMutation } from "@tanstack/svelte-query"
  import SuperDebug, { superForm, defaults } from "sveltekit-superforms"
  import { createTableCommand } from "@undb/commands"
  import { zodClient } from "sveltekit-superforms/adapters"
  import { Input } from "$lib/components/ui/input"
  import CreateSchema from "./create-schema.svelte"
  import { toast } from "svelte-sonner"
  import { invalidate } from "$app/navigation"
  import { goto } from "$app/navigation"
  import { FieldIdVo, getNextName } from "@undb/table"
  import { CREATE_TABLE_MODAL, closeModal } from "$lib/store/modal.store"

  const mutation = createMutation({
    mutationFn: trpc.table.create.mutate,
    async onSuccess(data) {
      await invalidate("undb:tables")
      await goto(`/t/${data}`)
      closeModal(CREATE_TABLE_MODAL)
      form.reset()
    },
    onError(error) {
      toast.error(error.message)
    },
  })

  const form = superForm(
    defaults(
      {
        name: "table",
        schema: [
          {
            id: FieldIdVo.create().value,
            type: "string",
            name: getNextName(),
            constraint: {},
          },
        ],
      },
      zodClient(createTableCommand),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zodClient(createTableCommand),
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

<form id="createTable" class="px-1" method="POST" use:enhance>
  <Form.Field {form} name="name">
    <Form.Control let:attrs>
      <Form.Label>Name</Form.Label>
      <Input {...attrs} bind:value={$formData.name} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Fieldset {form} name="schema">
    <CreateSchema />
  </Form.Fieldset>
</form>

<!-- <div class="mt-2">
  <SuperDebug data={$formData} />
</div> -->
