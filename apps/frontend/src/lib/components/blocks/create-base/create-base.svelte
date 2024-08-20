<script lang="ts">
  import * as Form from "$lib/components/ui/form"
  import { trpc } from "$lib/trpc/client.js"
  import { createMutation } from "@tanstack/svelte-query"
  import { superForm, defaults } from "sveltekit-superforms"
  import { createBaseCommand } from "@undb/commands"
  import { zodClient } from "sveltekit-superforms/adapters"
  import { Input } from "$lib/components/ui/input"
  import { toast } from "svelte-sonner"
  import { CREATE_BASE_MODAL, closeModal } from "$lib/store/modal.store"
  import { goto } from "$app/navigation"
  import { LoaderCircleIcon } from "lucide-svelte"

  const mutation = createMutation({
    mutationFn: trpc.base.create.mutate,
    async onSuccess(data) {
      await goto(`/bases/${data}`)
      closeModal(CREATE_BASE_MODAL)
      form.reset()
    },
    onError(error) {
      toast.error(error.message)
    },
  })

  const schema = createBaseCommand.omit({ spaceId: true })

  const form = superForm(
    defaults(
      {
        name: "base",
      },
      zodClient(schema),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zodClient(schema),
      resetForm: false,
      delayMs: 200,
      invalidateAll: true,
      onSubmit(event) {
        validateForm({ update: true })
      },
      onUpdate(event) {
        if (!event.form.valid) return

        $mutation.mutate(event.form.data)
      },
    },
  )

  const { form: formData, enhance, delayed, validateForm } = form
</script>

<form id="createTable" class="space-y-2 px-1" method="POST" use:enhance>
  <Form.Field {form} name="name">
    <Form.Control let:attrs>
      <Form.Label>Name</Form.Label>
      <Input {...attrs} bind:value={$formData.name} placeholder="Set base display name..." />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <div class="flex items-center justify-end gap-2">
    <Form.FormButton type="button" variant="secondary" on:click={() => closeModal(CREATE_BASE_MODAL)}>
      Cancel
    </Form.FormButton>
    <Form.FormButton>
      {#if $delayed}
        <LoaderCircleIcon class="mr-2 h-5 w-5 animate-spin" />
      {/if}
      Create
    </Form.FormButton>
  </div>
</form>

<!-- <div class="mt-2">
  <SuperDebug data={$formData} />
</div> -->
