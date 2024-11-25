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
  import { invalidateAll } from "$app/navigation"
  import { getNextName } from "@undb/utils"
  import { LL } from "@undb/i18n/client"

  const schema = createDashboardCommand.omit({ baseId: true, baseName: true })
  export let dashboardNames: string[]

  const form = superForm(
    defaults(
      {
        name: getNextName(dashboardNames, "Dashboard"),
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
          const _baseId = $currentBase?.id ?? $baseId
          if (!_baseId) return
          $createDashboard.mutate({
            ...f.data,
            baseId: _baseId,
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
    async onSuccess() {
      toast.success("Dashboard created successfully")
      await invalidateAll()
      closeModal(CREATE_DASHBOARD_MODAL)
    },
    onError(error) {
      toast.error(error.message)
    },
  })
</script>

<form method="POST" class="space-y-3" use:enhance>
  <Form.Field {form} name="name">
    <Form.Control let:attrs>
      <Form.Label>{$LL.common.name()}</Form.Label>
      <Input {...attrs} bind:value={$formData.name} />
    </Form.Control>
    <Form.Description>{$LL.dashboard.nameDescription()}</Form.Description>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Button disabled={$createDashboard.isPending}>{$LL.common.create()}</Form.Button>
  {#if browser}
    <!-- <SuperDebug data={$formData} /> -->
  {/if}
</form>
