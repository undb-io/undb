<script lang="ts">
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import type { IBaseDTO } from "@undb/base"
  import { updateBaseCommand } from "@undb/commands"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import * as Form from "$lib/components/ui/form"
  import { Switch } from "$lib/components/ui/switch"
  import Input from "$lib/components/ui/input/input.svelte"
  import { hasPermission } from "$lib/store/space-member.store"
  import { Button } from "$lib/components/ui/button"
  import { toast } from "svelte-sonner"
  import { goto, invalidateAll } from "$app/navigation"

  export let base: Omit<IBaseDTO, "spaceId">
  let deleteConfirm = ""

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

  let open = false

  const deleteSpaceMutation = createMutation({
    mutationFn: trpc.base.delete.mutate,
    onError(error, variables, context) {
      toast.error(error.message)
    },
    async onSuccess() {
      toast.success("Base deleted successfully")
      await invalidateAll()
      open = false
      goto("/")
    },
  })
</script>

<section class="space-y-6">
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

  <div class="max-w-4xl space-y-3 rounded-md border-2 border-red-500 p-4">
    <p class="text-red-500">Danger Zone</p>
    <div>Delete Base</div>

    <AlertDialog.Root bind:open>
      <AlertDialog.Trigger asChild let:builder>
        <Button variant="destructive" builders={[builder]} disabled={!$hasPermission("base:delete")}>
          Delete Base
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Header>
          <AlertDialog.Title>Are you absolutely sure to delete base?</AlertDialog.Title>
          <AlertDialog.Description>
            You are about to delete base <span class="text-red-500">{base.name}</span>. <br /> This action cannot be undone.
            This will permanently delete your database state and remove your data from our servers.
          </AlertDialog.Description>
        </AlertDialog.Header>

        <p>Please type <span class="text-red-500">DELETE</span> to confirm.</p>
        <Input bind:value={deleteConfirm} placeholder="DELETE" />

        <AlertDialog.Footer>
          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
          <AlertDialog.Action let:builder asChild>
            <Button
              variant="destructive"
              builders={[builder]}
              disabled={//
              $deleteSpaceMutation.isPending || deleteConfirm !== "DELETE" || !$hasPermission("space:delete")}
              on:click={async () => {
                await $deleteSpaceMutation.mutateAsync({ id: base.id })
              }}
            >
              Delete Base
            </Button>
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  </div>
</section>
