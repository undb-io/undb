<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import * as Form from "$lib/components/ui/form"
  import { Input } from "$lib/components/ui/input"
  import { Loader2 } from "lucide-svelte"
  import { toggleModal, UPDATE_TABLE_MODAL } from "$lib/store/modal.store"
  import { updateTableDTO } from "@undb/table"
  import { toast } from "svelte-sonner"
  import { invalidate } from "$app/navigation"

  const table = getTable()

  const updateTableMutation = createMutation({
    mutationKey: ["table", $table.id.value, "update"],
    mutationFn: trpc.table.update.mutate,
    async onSuccess(data, variables, context) {
      toast.success("Table updated")
      await invalidate(`undb:table:${$table.id.value}`)
      toggleModal(UPDATE_TABLE_MODAL)
    },
    onError(error, variables, context) {
      toast.error(error.message)
    },
  })

  const form = superForm(
    defaults(
      {
        name: $table.name.value,
        id: $table.id.value,
      },
      zodClient(updateTableDTO),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zodClient(updateTableDTO),
      resetForm: false,
      invalidateAll: true,
      onUpdate(event) {
        if (!event.form.valid) return

        $updateTableMutation.mutate(event.form.data)
      },
    },
  )
  const { enhance, form: formData } = form
</script>

<div>
  <form class="space-y-4" method="POST" use:enhance>
    <Form.Field {form} name="name">
      <Form.Control let:attrs>
        <Form.Label>Name</Form.Label>
        <Input autofocus {...attrs} bind:value={$formData.name} />
      </Form.Control>
      <Form.Description />
      <Form.FieldErrors />
    </Form.Field>

    <Form.FormButton disabled={$updateTableMutation.isPending} class="w-full">
      {#if $updateTableMutation.isPending}
        <Loader2 className="w-4 h-4 animate-spin" />
      {/if}
      Submit
    </Form.FormButton>
  </form>
</div>
