<script lang="ts">
  import { superForm } from "sveltekit-superforms/client"
  import { zodClient } from "sveltekit-superforms/adapters"
  import { Loader2 } from "lucide-svelte"
  import * as Form from "$lib/components/ui/form"
  import { Input } from "$lib/components/ui/input"
  import { Button } from "$lib/components/ui/button"
  import { createViewWidgetCommand } from "@undb/commands"
  import { defaults } from "sveltekit-superforms"
  import { getTable } from "$lib/store/table.store"
  import { WidgetVO } from "@undb/table"
  import { PlugIcon } from "lucide-svelte"
  import { createMutation } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { invalidate } from "$app/navigation"

  const table = getTable()
  export let viewId: string

  export let onSuccess: () => void = () => {}

  const form = superForm(
    defaults(
      {
        tableId: $table.id.value,
        viewId,
        widget: WidgetVO.default().toJSON(),
      },
      zodClient(createViewWidgetCommand),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zodClient(createViewWidgetCommand),
      taintedMessage: null,
      invalidateAll: false,
      onSubmit(input) {
        validateForm({ update: true })
      },
      onUpdate(event) {
        if (!event.form.valid) return

        $createViewWidgetMutation.mutate(event.form.data)
      },
    },
  )

  const { form: formData, enhance, validateForm, allErrors, tainted, reset, errors } = form

  const createViewWidgetMutation = createMutation({
    mutationFn: trpc.table.view.widget.create.mutate,
    async onSuccess(data) {
      await invalidate(`table:${$table.id.value}`)
      onSuccess()
    },
  })
</script>

<form method="POST" use:enhance>
  <Form.Field {form} name="widget.name">
    <Form.Control let:attrs>
      <Form.Label>Name</Form.Label>
      <Input {...attrs} bind:value={$formData.widget.name} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Button type="submit" variant="outline" disabled={$createViewWidgetMutation.isPending} class="w-full">
    {#if $createViewWidgetMutation.isPending}
      <Loader2 class="mr-2 h-4 w-4 animate-spin" />
    {:else}
      <PlugIcon class="mr-2 h-4 w-4" />
    {/if}
    Create Widget
  </Button>
</form>
