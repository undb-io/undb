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
  import { FieldIdVo } from "@undb/table"
  import { CREATE_TABLE_MODAL, closeModal } from "$lib/store/modal.store"
  import { baseId, currentBase } from "$lib/store/base.store"
  import { getNextName } from "@undb/utils"

  const schema = createTableCommand.omit({ baseId: true })
  export let tableNames: string[]

  const mutation = createMutation({
    mutationFn: trpc.table.create.mutate,
    mutationKey: ["createTable"],
    async onSuccess(data) {
      await invalidate("undb:tables")
      await goto(`/t/${data}`)
      baseId.set(null)
      form.reset()
      closeModal(CREATE_TABLE_MODAL)
    },
    onError(error) {
      toast.error(error.message)
    },
  })

  const form = superForm(
    defaults(
      {
        name: getNextName(tableNames, "Table"),
        schema: [
          {
            id: FieldIdVo.create().value,
            type: "string",
            name: "Title",
            display: true,
            constraint: {},
          },
        ],
      },
      zodClient(schema),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zodClient(schema),
      resetForm: false,
      invalidateAll: true,
      onSubmit(input) {
        validateForm({ update: true })
      },
      async onUpdate(event) {
        if (!event.form.valid) {
          console.log(event.form.errors)
          return
        }
        const _baseId = $currentBase?.id ?? $baseId
        if (!_baseId) return

        await $mutation.mutateAsync({
          ...event.form.data,
          baseId: _baseId,
        })
      },
    },
  )

  const { form: formData, enhance, validateForm } = form
</script>

<form id="createTable" class="px-1" method="POST" use:enhance>
  <Form.Field {form} name="name">
    <Form.Control let:attrs>
      <Form.Label>Name</Form.Label>
      <Input {...attrs} bind:value={$formData.name} placeholder="Set table display name..." />
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
