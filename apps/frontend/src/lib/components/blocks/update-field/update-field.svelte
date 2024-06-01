<script lang="ts">
  import { invalidate } from "$app/navigation"
  import { Button } from "$lib/components/ui/button"
  import * as Form from "$lib/components/ui/form"
  import { Input } from "$lib/components/ui/input"
  import { CREATE_FIELD_MODAL, closeModal } from "$lib/store/modal.store"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { getIsSystemFieldType, updateFieldDTO, type Field } from "@undb/table"
  import { toast } from "svelte-sonner"
  import { derived } from "svelte/store"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import FieldOptions from "../field-options/field-options.svelte"
  import FieldTypePicker from "../field-picker/field-type-picker.svelte"
  import autoAnimate from "@formkit/auto-animate"

  const table = getTable()

  export let field: Field

  const updateFieldMutation = createMutation(
    derived([table], ([$table]) => ({
      mutationKey: ["table", $table.id.value, "updateField"],
      mutationFn: trpc.table.field.update.mutate,
      async onSuccess() {
        closeModal(CREATE_FIELD_MODAL)
        toast.success("Create field success")
        reset()
        await invalidate(`table:${$table.id.value}`)
      },
      onError(error: Error) {
        toast.error(error.message)
      },
    })),
  )

  function getDefaultValue() {
    return {
      type: field.type,
      name: field.name.value,
      display: field.display,
      constraint: field.constraint.into(),
    }
  }

  function setDefaultValue() {
    form.reset({ data: getDefaultValue() })
  }

  $: field, setDefaultValue()

  const form = superForm(
    defaults(
      {
        type: field.type,
        name: field.name.value,
        display: field.display,
        constraint: field.constraint.into(),
      },
      zodClient(updateFieldDTO),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zodClient(updateFieldDTO),
      resetForm: false,
      invalidateAll: false,
      onUpdate(event) {
        if (!event.form.valid) return

        $updateFieldMutation.mutate({
          tableId: $table.id.value,
          field: event.form.data,
        })
      },
    },
  )

  const { enhance, form: formData, reset } = form
</script>

<form method="POST" use:enhance class="space-y-4">
  <div class="flex h-8 items-center gap-2">
    <Form.Field {form} name="type" class="h-full">
      <Form.Control let:attrs>
        <FieldTypePicker
          {...attrs}
          bind:value={$formData.type}
          tabIndex={-1}
          class="h-full"
          disabled={getIsSystemFieldType($formData.type)}
        />
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

  <div use:autoAnimate>
    {#if !getIsSystemFieldType($formData.type)}
      <Form.Field {form} name="constraint">
        <Form.Control let:attrs>
          <FieldOptions
            type={$formData.type}
            bind:constraint={$formData.constraint}
            bind:display={$formData.display}
            bind:defaultValue={$formData.defaultValue}
          />
        </Form.Control>
        <Form.Description />
        <Form.FieldErrors />
      </Form.Field>
    {/if}
  </div>
  <div class="flex w-full justify-end">
    <Button type="submit">Submit</Button>
  </div>
</form>
