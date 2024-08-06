<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js"
  import { Input } from "$lib/components/ui/input/index.js"
  import { trpc } from "$lib/trpc/client"
  import { createMutation, QueryObserver, useQueryClient } from "@tanstack/svelte-query"
  import { createApiTokenCommand } from "@undb/commands"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import * as Form from "$lib/components/ui/form/index.js"
  import { PlusIcon } from "lucide-svelte"
  import * as Dialog from "$lib/components/ui/dialog"
  import { toast } from "svelte-sonner"

  export let userId: string
  const form = superForm(
    defaults(
      {
        userId,
        name: "",
      },
      zodClient(createApiTokenCommand),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zodClient(createApiTokenCommand),
      resetForm: false,
      invalidateAll: false,
      onUpdate(event) {
        if (!event.form.valid) return

        $createApiTokenMutation.mutate(event.form.data)
      },
    },
  )
  const { enhance, form: formData } = form

  const client = useQueryClient()
  const observer = new QueryObserver(client, {
    queryKey: ["apiTokens"],
  })

  const createApiTokenMutation = createMutation({
    mutationFn: trpc.apiToken.create.mutate,
    mutationKey: ["createApiToken"],
    onError(error, variables, context) {
      toast.error(error.message)
    },
    async onSuccess(data, variables, context) {
      open = false
      $observer.refetch()
    },
  })

  let open = false
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger asChild let:builder>
    <Button builders={[builder]} {...$$restProps}>
      <PlusIcon class="mr-2 h-4 w-4" />
      Create Api Token
    </Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Create Api Token</Dialog.Title>
      <Dialog.Description>Create api token to access the API.</Dialog.Description>
    </Dialog.Header>

    <form method="POST" use:enhance class="space-y-2">
      <Form.Field {form} name="name">
        <Form.Control let:attrs>
          <Form.Label>Name</Form.Label>
          <Input {...attrs} bind:value={$formData.name} placeholder="Set api token display name..." />
        </Form.Control>
        <Form.Description>Public token diplay name.</Form.Description>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Button>Create</Form.Button>
    </form>
  </Dialog.Content>
</Dialog.Root>
