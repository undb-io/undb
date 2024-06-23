<script lang="ts">
  import { invalidate } from "$app/navigation"
  import * as Form from "$lib/components/ui/form"
  import { Button } from "$lib/components/ui/button"
  import * as Popover from "$lib/components/ui/popover"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { createFormDTO, createViewDTO } from "@undb/table"
  import { PlusCircleIcon } from "lucide-svelte"
  import { toast } from "svelte-sonner"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import { Input } from "$lib/components/ui/input"
  import { cn } from "$lib/utils"
  import FormButton from "$lib/components/ui/form/form-button.svelte"

  let open = false

  const table = getTable()

  const createViewMutation = createMutation({
    mutationFn: trpc.table.view.create.mutate,
    mutationKey: ["table", $table.id.value, "createView"],
    onSuccess() {
      toast.success("created view successfully")
      invalidate(`table:${$table.id.value}`)
    },
    onError(e) {
      toast.error(e.message)
    },
    onSettled() {
      open = false
    },
  })

  const form = superForm(
    defaults(
      {
        name: "view",
        type: "grid",
      },
      zodClient(createViewDTO),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zodClient(createViewDTO),
      resetForm: false,
      invalidateAll: false,
      onUpdate(event) {
        if (!event.form.valid) return

        $createViewMutation.mutate({ tableId: $table.id.value, ...event.form.data })
      },
    },
  )

  const { enhance, form: formData } = form
</script>

<Popover.Root bind:open>
  <Popover.Trigger asChild let:builder>
    <Button class={cn("mt-4", $$restProps.class)} builders={[builder]} {...$$restProps}>
      <slot>
        <PlusCircleIcon class="mr-2 h-4 w-4" />
        Create View
      </slot>
    </Button>
  </Popover.Trigger>
  <Popover.Content>
    <form method="POST" use:enhance>
      <Form.Field {form} name="name">
        <Form.Control let:attrs>
          <Form.Label>Name</Form.Label>
          <Input {...attrs} bind:value={$formData.name} />
        </Form.Control>
        <Form.Description />
        <Form.FieldErrors />
      </Form.Field>

      <Form.FormButton class="w-full">Create</Form.FormButton>
    </form>
  </Popover.Content>
</Popover.Root>
