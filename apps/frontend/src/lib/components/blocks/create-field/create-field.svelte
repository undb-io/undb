<script lang="ts">
  import { invalidate } from "$app/navigation"
  import { Button } from "$lib/components/ui/button"
  import * as Form from "$lib/components/ui/form"
  import { Input } from "$lib/components/ui/input"
  import { CREATE_FIELD_MODAL, closeModal } from "$lib/store/modal.store"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { createFieldDTO, FieldIdVo, type FieldType } from "@undb/table"
  import { toast } from "svelte-sonner"
  import { derived } from "svelte/store"
  import SuperDebug, { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import FieldOptions from "../field-options/field-options.svelte"
  import FieldTypePicker from "../field-picker/field-type-picker.svelte"
  import { createDefaultField } from "./create-default-field"

  const table = getTable()

  const client = useQueryClient()
  const createFieldMutation = createMutation(
    derived([table], ([$table]) => ({
      mutationKey: ["table", $table.id.value, "createField"],
      mutationFn: trpc.table.field.create.mutate,
      async onSuccess() {
        closeModal(CREATE_FIELD_MODAL)
        toast.success("Create field success")
        reset()
        await invalidate(`table:${$table.id.value}`)
        await client.invalidateQueries({ queryKey: ["records", $table.id.value] })
      },
      onError(error: Error) {
        toast.error(error.message)
      },
    })),
  )

  const form = superForm(
    defaults(
      {
        type: "string",
        name: $table.schema.getNextFieldName(),
        display: false,
        constraint: {},
      },
      zodClient(createFieldDTO),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zodClient(createFieldDTO),
      resetForm: false,
      invalidateAll: false,
      onUpdate(event) {
        if (!event.form.valid) return

        $createFieldMutation.mutate({
          tableId: $table.id.value,
          field: event.form.data,
        })
      },
    },
  )

  const { enhance, form: formData, reset } = form

  function updateType(type: FieldType) {
    $formData = createDefaultField($table, type)
  }

  function onTypeChange(type: FieldType) {
    updateType(type)
  }
</script>

<form method="POST" use:enhance class="space-y-4">
  <div class="flex h-8 items-center gap-2">
    <Form.Field {form} name="type" class="h-full">
      <Form.Control let:attrs>
        <FieldTypePicker {...attrs} value={$formData.type} onValueChange={onTypeChange} tabIndex={-1} class="h-full" />
      </Form.Control>
      <Form.Description />
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="name" class="h-full flex-1">
      <Form.Control let:attrs>
        <Input {...attrs} bind:value={$formData.name} autofocus class="h-full" />
      </Form.Control>
      <Form.Description />
      <Form.FieldErrors />
    </Form.Field>
  </div>

  <FieldOptions
    type={$formData.type}
    bind:option={$formData.option}
    bind:constraint={$formData.constraint}
    bind:display={$formData.display}
    bind:defaultValue={$formData.defaultValue}
  />

  <div class="flex w-full justify-end">
    <Button type="submit">Submit</Button>
  </div>
</form>

<!-- <SuperDebug data={$formData} /> -->
