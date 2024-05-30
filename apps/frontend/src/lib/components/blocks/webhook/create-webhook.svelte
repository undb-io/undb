<script lang="ts">
  import * as Form from "$lib/components/ui/form"
  import { trpc } from "$lib/trpc/client.js"
  import { createMutation } from "@tanstack/svelte-query"
  import SuperDebug, { superForm, defaults } from "sveltekit-superforms"
  import { createWebhookCommand } from "@undb/commands"
  import { zodClient } from "sveltekit-superforms/adapters"
  import { Input } from "$lib/components/ui/input"
  import { toast } from "svelte-sonner"

  const createWebhookMutation = createMutation({
    mutationFn: trpc.webhook.create.mutate,
    async onSuccess(data) {
      form.reset()
    },
    onError(error) {
      toast.error(error.message)
    },
  })

  const form = superForm(
    defaults(
      {
        name: "webhook",
      },
      zodClient(createWebhookCommand),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zodClient(createWebhookCommand),
      resetForm: false,
      invalidateAll: true,
      onUpdate(event) {
        if (!event.form.valid) return

        // $mutation.mutate(event.form.data)
      },
    },
  )

  const { form: formData, enhance } = form
</script>

<form id="createTable" class="px-1" method="POST" use:enhance>
  <Form.Field {form} name="name">
    <Form.Control let:attrs class="grid gap-3">
      <Form.Label>Name</Form.Label>
      <Input {...attrs} bind:value={$formData.name} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
</form>

<!-- <div class="mt-2">
  <SuperDebug data={$formData} />
</div> -->
