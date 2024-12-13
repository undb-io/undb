<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import { createMutation } from "@tanstack/svelte-query"
  import { LoaderCircleIcon } from "lucide-svelte"
  import { duplicateViewCommand } from "@undb/commands"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import * as Form from "$lib/components/ui/form"
  import { Input } from "$lib/components/ui/input"
  import { closeModal, DUPLICATE_VIEW } from "$lib/store/modal.store"
  import { getNextName } from "@undb/utils"
  import { toast } from "svelte-sonner"
  import { invalidate, goto } from "$app/navigation"
  import type { Readable } from "svelte/store"
  import { getDataService } from "$lib/store/data-service.store"
  import { getIsPlayground } from "$lib/store/playground.svelte"

  const table = getTable()
  export let viewId: Readable<string | undefined>

  const isPlayground = getIsPlayground()

  const dataService = getDataService()

  const duplicateViewMutation = createMutation({
    mutationFn: dataService.table.view.duplicateView,
    mutationKey: ["table", $viewId, "duplicateView"],
    async onSuccess(data, variables, context) {
      closeModal(DUPLICATE_VIEW)
      toast.success("View duplicated")
      await invalidate(`undb:table:${data.tableId}`)
      if (isPlayground) {
        await goto(`/playground/bases/${data.baseId}/t/${data.tableId}/${data.viewId}`)
      } else {
        await goto(`/t/${data.tableId}/${data.viewId}`)
      }
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

    <Form.FormButton disabled={$duplicateViewMutation.isPending} class="w-full">
      {#if $duplicateViewMutation.isPending}
        <LoaderCircleIcon class="mr-2 size-4 animate-spin" />
      {/if}
      Duplicate</Form.FormButton
    >
  </form>
</div>
