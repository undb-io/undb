<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte"
  import * as Dialog from "$lib/components/ui/dialog"
  import Input from "$lib/components/ui/input/input.svelte"
  import { createMutation } from "@tanstack/svelte-query"
  import { inviteCommand } from "@undb/commands"
  import { PlusIcon, UserPlus } from "lucide-svelte"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import * as Form from "$lib/components/ui/form/index.js"
  import { trpc } from "$lib/trpc/client"
  import { toast } from "svelte-sonner"

  const form = superForm(
    defaults(
      {
        email: "",
        role: "viewer",
      },
      zodClient(inviteCommand),
    ),
    {
      SPA: true,
      dataType: "json",
      // validators: zodClient(schema),
      resetForm: false,
      invalidateAll: false,
      onUpdate(event) {
        if (!event.form.valid) {
          return
        }

        $invite.mutate({
          email: event.form.data.email,
          role: event.form.data.role,
        })
      },
    },
  )

  const { form: formData, enhance } = form

  const invite = createMutation({
    mutationFn: trpc.authz.invite.mutate,
    onSuccess(data, variables, context) {
      open = false
    },
    onError(error, variables, context) {
      toast.error(error.message)
    },
  })

  let open = false
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger asChild let:builder>
    <slot>
      <Button size="sm" builders={[builder]}>
        <UserPlus class="mr-2 h-3 w-3 font-semibold" />
        Invite Member
      </Button>
    </slot>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Invite to workspace</Dialog.Title>
    </Dialog.Header>

    <form method="POST" use:enhance>
      <Form.Field {form} name="email">
        <Form.Control let:attrs>
          <Form.Label>Email</Form.Label>
          <Input {...attrs} bind:value={$formData.email} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Button>Submit</Form.Button>
    </form>
  </Dialog.Content>
</Dialog.Root>
