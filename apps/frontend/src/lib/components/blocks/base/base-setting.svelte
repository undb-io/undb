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
  import { LoaderCircleIcon } from "lucide-svelte"
  import { Loader2, TrashIcon } from "lucide-svelte"
  import { LL } from "@undb/i18n/client"

  export let base: Omit<IBaseDTO, "spaceId">
  let deleteConfirm = ""

  const updateBaseMutation = createMutation({
    mutationKey: ["base", base.id, "updateBase"],
    mutationFn: trpc.base.update.mutate,
    onError(error, variables, context) {
      toast.error(error.message)
    },
    onSuccess(data, variables, context) {
      toast.success("Base updated successfully")
    },
  })

  const form = superForm(
    defaults(
      {
        id: base.id,
        name: base.name,
      },
      zodClient(updateBaseCommand),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zodClient(updateBaseCommand),
      resetForm: false,
      invalidateAll: true,
      onSubmit(input) {
        validateForm()
      },
      onUpdate(event) {
        if (!event.form.valid) return

        $updateBaseMutation.mutate(event.form.data)
      },
    },
  )
  const { enhance, form: formData, validateForm, tainted } = form

  let open = false

  const deleteBaseMutation = createMutation({
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
    <legend class="mb-4 text-lg font-medium">{$LL.base.baseSettings()}</legend>
    <Form.Field {form} name="name" class="rounded-lg border p-4">
      <Form.Control let:attrs>
        <div class="space-y-0.5">
          <Form.Label>{$LL.common.name()}</Form.Label>
          <Form.Description>{$LL.base.nameDescription()}</Form.Description>
        </div>
        <Input {...attrs} bind:value={$formData.name} />
      </Form.Control>
      <Form.Description />
      <Form.FieldErrors />
    </Form.Field>

    <Form.Button disabled={!$tainted || $updateBaseMutation.isPending} size="sm">
      {#if $updateBaseMutation.isPending}
        <LoaderCircleIcon class="mr-2 h-4 w-4" />
      {/if}
      {$LL.base.updateBase()}
    </Form.Button>
  </form>

  <div class="max-w-4xl space-y-3 rounded-md border-2 border-red-500 p-4">
    <p class="text-red-500">{$LL.common.dangerZone()}</p>
    <div>{$LL.base.deleteBase()}</div>

    <AlertDialog.Root bind:open>
      <AlertDialog.Trigger asChild let:builder>
        <Button variant="destructive" builders={[builder]} disabled={!$hasPermission("base:delete")}>
          {$LL.base.deleteBase()}
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Header>
          <AlertDialog.Title>{$LL.base.deleteBaseConfirm()}</AlertDialog.Title>
          <AlertDialog.Description>
            You are about to delete base <span class="text-red-500">{base.name}</span>. <br /> This action cannot be undone.
            This will permanently delete your database state and remove your data from our servers.
          </AlertDialog.Description>
        </AlertDialog.Header>

        <p>Please type <span class="text-red-500">DELETE</span> to confirm.</p>
        <Input bind:value={deleteConfirm} placeholder="DELETE" />

        <AlertDialog.Footer>
          <AlertDialog.Cancel>{$LL.common.cancel()}</AlertDialog.Cancel>
          <AlertDialog.Action asChild>
            <Button
              variant="destructive"
              class="gap-2"
              disabled={//
              $deleteBaseMutation.isPending || deleteConfirm !== "DELETE" || !$hasPermission("space:delete")}
              on:click={async () => {
                await $deleteBaseMutation.mutateAsync({ id: base.id })
              }}
            >
              {#if $deleteBaseMutation.isPending}
                <Loader2 class="h-4 w-4 animate-spin" />
              {:else}
                <TrashIcon class="size-4" />
              {/if}
              {$LL.base.deleteBase()}
            </Button>
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  </div>
</section>
