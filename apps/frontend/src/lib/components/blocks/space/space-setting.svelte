<script lang="ts">
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { updateSpaceCommand } from "@undb/commands"
  import { zodClient } from "sveltekit-superforms/adapters"
  import SuperDebug, { defaults, superForm } from "sveltekit-superforms"
  import { browser } from "$app/environment"
  import * as Form from "$lib/components/ui/form/index.js"
  import { Input } from "$lib/components/ui/input/index.js"
  import type { ISpaceDTO } from "@undb/space"
  import { toast } from "svelte-sonner"
  import { Button } from "$lib/components/ui/button"
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js"
  import { hasPermission } from "$lib/store/space-member.store"
  import { LL } from "@undb/i18n/client"

  export let space: ISpaceDTO

  let deleteConfirm = ""

  const form = superForm(
    defaults(
      {
        name: space.name,
      },
      zodClient(updateSpaceCommand),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zodClient(updateSpaceCommand),
      resetForm: false,
      invalidateAll: false,
      async onUpdate(event) {
        if (!event.form.valid) {
          return
        }

        await $updateSpaceMutation.mutateAsync(event.form.data)
      },
    },
  )

  const updateSpaceMutation = createMutation({
    mutationFn: trpc.space.update.mutate,
    onSuccess() {
      toast.success("Space updated successfully")
    },
  })

  const { form: formData, enhance } = form

  const deleteSpaceMutation = createMutation({
    mutationFn: () => fetch("/api/space", { method: "DELETE" }),
    async onSuccess() {
      toast.success("Space deleted successfully")
      window.location.replace("/")
    },
  })
</script>

<section class="mx-auto space-y-6">
  <!-- Update space -->
  <form method="POST" class="w-2/3 space-y-4" use:enhance>
    <Form.Field {form} name="name">
      <Form.Control let:attrs>
        <Form.Label>{$LL.space.name()}</Form.Label>
        <Input
          {...attrs}
          disabled={!$hasPermission("space:update")}
          placeholder="Set space display name..."
          bind:value={$formData.name}
        />
      </Form.Control>
      <Form.Description>{$LL.space.setDisplayName()}</Form.Description>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Button disabled={!$hasPermission("space:update")}>{$LL.common.update()}</Form.Button>
    {#if browser}
      <!-- <SuperDebug data={$formData} /> -->
    {/if}
  </form>

  <!-- Delete space -->
  <div class="w-2/3 space-y-3 rounded-md border-2 border-red-500 p-4">
    <p class="text-red-500">{$LL.common.dangerZone()}</p>
    <div>{$LL.common.delete()}</div>

    {#if space.isPersonal}
      <p class="text-muted-foreground">{$LL.space.cannotDeletePersonalSpace()}</p>
    {/if}

    <AlertDialog.Root>
      <AlertDialog.Trigger asChild let:builder>
        <Button
          variant="destructive"
          builders={[builder]}
          disabled={space.isPersonal || !$hasPermission("space:delete")}
        >
          {$LL.space.deleteSpace()}
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Header>
          <AlertDialog.Title>{$LL.space.deleteSpaceConfirm()}</AlertDialog.Title>
          <AlertDialog.Description>
            {$LL.space.deleteSpaceDescription()}
          </AlertDialog.Description>
        </AlertDialog.Header>

        <p>Please type <span class="text-red-500">DELETE</span> to confirm.</p>
        <Input bind:value={deleteConfirm} placeholder="DELETE" />

        <AlertDialog.Footer>
          <AlertDialog.Cancel>{$LL.common.cancel()}</AlertDialog.Cancel>
          <AlertDialog.Action let:builder asChild>
            <Button
              variant="destructive"
              builders={[builder]}
              disabled={//
              $deleteSpaceMutation.isPending ||
                space.isPersonal ||
                deleteConfirm !== "DELETE" ||
                !$hasPermission("space:delete")}
              on:click={async () => {
                await $deleteSpaceMutation.mutateAsync()
              }}
            >
              {$LL.space.deleteSpace()}
            </Button>
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  </div>
</section>
