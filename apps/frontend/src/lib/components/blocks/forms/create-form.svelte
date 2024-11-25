<script lang="ts">
  import { invalidate } from "$app/navigation"
  import * as Form from "$lib/components/ui/form"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { createFormDTO } from "@undb/table"
  import { toast } from "svelte-sonner"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import { Input } from "$lib/components/ui/input"
  import { hasPermission } from "$lib/store/space-member.store"
  import { getNextName } from "@undb/utils"
  import { formId } from "$lib/store/tab.store"
  import { LL } from "@undb/i18n/client"

  const table = getTable()

  export let onSuccess: (() => void) | undefined = undefined

  const createFormMutation = createMutation({
    mutationFn: trpc.table.form.create.mutate,
    mutationKey: ["table", $table.id.value, "createForm"],
    async onSuccess(data) {
      toast.success("create form successfully")
      await invalidate(`undb:table:${$table.id.value}`)
      formId.set(data.formId)
      onSuccess?.()
    },
    onError(e) {
      toast.error(e.message)
    },
  })

  const form = superForm(
    defaults(
      {
        name: getNextName($table.forms?.forms.map((f) => f.name) ?? [], "form"),
      },
      zodClient(createFormDTO),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zodClient(createFormDTO),
      resetForm: false,
      invalidateAll: false,
      onSubmit(input) {
        validateForm({ update: true })
      },
      onUpdate(event) {
        if (!event.form.valid) return

        $createFormMutation.mutate({ tableId: $table.id.value, ...event.form.data })
      },
    },
  )

  const { enhance, form: formData, validateForm } = form
</script>

{#if $hasPermission("table:update")}
  <form method="POST" use:enhance>
    <Form.Field {form} name="name">
      <Form.Control let:attrs>
        <Form.Label>{$LL.common.name()}</Form.Label>
        <Input {...attrs} bind:value={$formData.name} disabled={$createFormMutation.isPending} />
      </Form.Control>
      <Form.Description />
      <Form.FieldErrors />
    </Form.Field>
    <Form.FormButton disabled={$createFormMutation.isPending} class="w-full">{$LL.common.create()}</Form.FormButton>
  </form>
{/if}
