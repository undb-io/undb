<script lang="ts">
  import { toggleModal } from "$lib/store/modal.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import type { IBaseDTO } from "@undb/base"
  import { updateBaseCommand } from "@undb/commands"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import * as Form from "$lib/components/ui/form"
  import { Switch } from "$lib/components/ui/switch"
  import Input from "$lib/components/ui/input/input.svelte"

  export let base: Omit<IBaseDTO, "spaceId">

  const updateBaseMutation = createMutation({
    mutationKey: ["base", base.id, "updateBase"],
    mutationFn: trpc.base.update.mutate,
  })

  const form = superForm(
    defaults(
      {
        id: base.id,
        name: base.name,
        allowTemplate: base.option?.allowTemplate,
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

<section>
  <form class="max-w-4xl space-y-4" method="POST" use:enhance>
    <legend class="mb-4 text-lg font-medium"> Base Setting </legend>
    <Form.Field {form} name="name" class="rounded-lg border p-4">
      <Form.Control let:attrs>
        <div class="space-y-0.5">
          <Form.Label>Name</Form.Label>
          <Form.Description>Base name.</Form.Description>
        </div>
        <Input {...attrs} bind:value={$formData.name} />
      </Form.Control>
      <Form.Description />
      <Form.FieldErrors />
    </Form.Field>
    <fieldset>
      <div class="space-y-4">
        <Form.Field
          {form}
          name="allowTemplate"
          class="flex flex-row items-center justify-between rounded-lg border p-4"
        >
          <Form.Control let:attrs>
            <div class="space-y-0.5">
              <Form.Label>Allow Template</Form.Label>
              <Form.Description>Allow users to create templates from base.</Form.Description>
            </div>
            <Switch includeInput {...attrs} bind:checked={$formData.allowTemplate} />
          </Form.Control>
        </Form.Field>
      </div>
    </fieldset>

    <Form.Button size="sm">Submit</Form.Button>
  </form>
</section>
