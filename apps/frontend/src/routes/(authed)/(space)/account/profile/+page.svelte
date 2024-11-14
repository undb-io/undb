<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js"
  import { Input } from "$lib/components/ui/input/index.js"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { updateaccountCommand } from "@undb/commands"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import type { PageData } from "./$types"
  import * as Form from "$lib/components/ui/form/index.js"
  import Label from "$lib/components/ui/label/label.svelte"
  import { toast } from "svelte-sonner"

  export let data: PageData

  const form = superForm(
    defaults(
      {
        userId: data.me.user.userId,
        username: data.me.user.username,
      },
      zodClient(updateaccountCommand),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zodClient(updateaccountCommand),
      resetForm: false,
      invalidateAll: false,
      onSubmit(input) {
        validateForm({ update: true })
      },
      onChange(event) {
        validateForm({ update: true })
      },
      onUpdate(event) {
        if (!event.form.valid) return

        $updateAccountMutation.mutate(event.form.data)
      },
    },
  )
  const { enhance, form: formData, validateForm, allErrors } = form

  const updateAccountMutation = createMutation({
    mutationFn: trpc.user.updateAccount.mutate,
    mutationKey: ["updateAccount"],
    onSuccess() {
      toast.success("Account updated")
    },
  })
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>User Name</Card.Title>
  </Card.Header>
  <Card.Content>
    <form method="POST" use:enhance class="space-y-2">
      <Form.Field {form} name="username">
        <Form.Control let:attrs>
          <Form.Label>Username</Form.Label>
          <Input {...attrs} bind:value={$formData.username} />
        </Form.Control>
        <Form.Description>This is your public display name.</Form.Description>
        <Form.FieldErrors />
      </Form.Field>

      <Label>Email</Label>
      <Input disabled bind:value={data.me.user.email} />

      <Form.Button disabled={$updateAccountMutation.isPending || $allErrors.length > 0}>Save</Form.Button>
    </form>
  </Card.Content>
</Card.Root>
