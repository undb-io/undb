<script lang="ts">
  import { invalidate } from "$app/navigation"
  import * as Form from "$lib/components/ui/form"
  import { Button } from "$lib/components/ui/button"
  import * as Popover from "$lib/components/ui/popover"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { createViewDTO } from "@undb/table"
  import { getNextName } from "@undb/utils"
  import { PlusCircleIcon } from "lucide-svelte"
  import { toast } from "svelte-sonner"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import { Input } from "$lib/components/ui/input"
  import { cn } from "$lib/utils"
  import { hasPermission } from "$lib/store/space-member.store"

  let open = false

  export let tableId: string
  export let viewNames: string[]

  const createViewMutation = createMutation({
    mutationFn: trpc.table.view.create.mutate,
    mutationKey: ["table", tableId, "createView"],
    onSuccess() {
      toast.success("created view successfully")
      invalidate(`table:${tableId}`)
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
        name: getNextName(viewNames, "Grid View"),
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

        $createViewMutation.mutate({ tableId, ...event.form.data })
      },
    },
  )

  const { enhance, form: formData } = form
</script>

{#if $hasPermission("table:update")}
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
{/if}
