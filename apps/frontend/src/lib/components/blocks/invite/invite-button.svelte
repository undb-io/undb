<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte"
  import * as Dialog from "$lib/components/ui/dialog"
  import Input from "$lib/components/ui/input/input.svelte"
  import { createMutation } from "@tanstack/svelte-query"
  import { inviteCommand } from "@undb/commands"
  import { LoaderCircleIcon, UserPlus } from "lucide-svelte"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import * as Form from "$lib/components/ui/form/index.js"
  import { trpc } from "$lib/trpc/client"
  import { toast } from "svelte-sonner"
  import RolePicker from "../role/role-picker.svelte"
  import { page } from "$app/stores"
  import { LL } from "@undb/i18n/client"

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
      validators: zodClient(inviteCommand),
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
      <Button size="sm" builders={[builder]} {...$$restProps}>
        <UserPlus class="mr-2 h-3 w-3 font-semibold" />
        {$LL.space.inviteMember()}
      </Button>
    </slot>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{$LL.space.inviteMember()}</Dialog.Title>
    </Dialog.Header>

    <form method="POST" use:enhance>
      <Form.Field {form} name="email">
        <Form.Control let:attrs>
          <Form.Label>{$LL.common.email()}</Form.Label>
          <Input {...attrs} bind:value={$formData.email} placeholder="invitee@example.com" />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="role">
        <Form.Control let:attrs>
          <Form.Label>{$LL.common.role()}</Form.Label>
          <RolePicker bind:role={$formData.role} />
          <input hidden bind:value={$formData.role} name={attrs.name} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Button disabled={$invite.isPending} class="mt-4">
        {#if $invite.isPending}
          <LoaderCircleIcon class="mr-2 h-5 w-5 animate-spin" />
        {/if}
        {$LL.space.invite()}
      </Form.Button>
    </form>
  </Dialog.Content>
</Dialog.Root>
