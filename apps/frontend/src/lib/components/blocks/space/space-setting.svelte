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

  export let space: ISpaceDTO

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
      invalidateAll: true,
      onUpdate(event) {
        if (!event.form.valid) {
          return
        }

        $updateSpaceMutation.mutate(event.form.data)
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
</script>

<section class="mx-auto">
  <form method="POST" class="w-2/3 space-y-4" use:enhance>
    <Form.Field {form} name="name">
      <Form.Control let:attrs>
        <Form.Label>Space name</Form.Label>
        <Input {...attrs} placeholder="Set space display name..." bind:value={$formData.name} />
      </Form.Control>
      <Form.Description>Change space display name.</Form.Description>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Button>Update</Form.Button>
    {#if browser}
      <!-- <SuperDebug data={$formData} /> -->
    {/if}
  </form>
</section>
