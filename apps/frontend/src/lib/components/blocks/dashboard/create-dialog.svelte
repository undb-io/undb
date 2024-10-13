<script lang="ts">
  import SuperDebug, { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import { toast } from "svelte-sonner"
  import { browser } from "$app/environment"
  import * as Form from "$lib/components/ui/form/index.js"
  import { Input } from "$lib/components/ui/input/index.js"
  import { createDashboardCommand } from "@undb/commands"
  import { createMutation } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { closeModal, CREATE_DASHBOARD_MODAL } from "$lib/store/modal.store"
  import { currentBase, baseId } from "$lib/store/base.store"

  const schema = createDashboardCommand.omit({ baseId: true, baseName: true })

  const form = superForm(
    defaults(
      {
        name: "dashboard",
      },
      zodClient(schema),
    ),
    {
      validators: zodClient(schema),
      SPA: true,
      dataType: "json",
      invalidateAll: false,
      resetForm: false,
      onSubmit(data) {
        validateForm({ update: true })
      },
      onUpdate: ({ form: f }) => {
        if (f.valid) {
          const baseId = $currentBase?.id ?? $baseId
          if (!baseId) return
          $createDashboard.mutate({
            ...f.data,
            baseId,
          })
        } else {
          toast.error("Please fix the errors in the form.")
        }
      },
    },
  )

  const { form: formData, enhance, validateForm } = form

  const createDashboard = createMutation({
    mutationFn: trpc.dashboard.create.mutate,
    onSuccess() {
      toast.success("Dashboard created successfully")
      closeModal(CREATE_DASHBOARD_MODAL)
    },
    onError(error) {
      toast.error(error.message)
    },
  })
</script>

<form method="POST" class=" space-y-6" use:enhance>
  <Form.Field {form} name="name">
    <Form.Control let:attrs>
      <Form.Label>Name</Form.Label>
      <Input {...attrs} bind:value={$formData.name} />
    </Form.Control>
    <Form.Description>This is dashboard's public display name.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Button disabled={$createDashboard.isPending}>Submit</Form.Button>
  {#if browser}
    <SuperDebug data={$formData} />
  {/if}
</form>
