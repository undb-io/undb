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
  import WidgetTypePicker from "./widget-type-picker.svelte"
  import { derived } from "svelte/store"
  import { getNextName } from "@undb/utils"
  import { toast } from "svelte-sonner"
  import { LL } from "@undb/i18n/client"

  const table = getTable()
  export let viewId: string

  let view = derived([table], ([$table]) => $table?.views.getViewById(viewId))
  let widgets = derived([view], ([$view]) => $view?.widgets.unwrapOr([]))
  let widgetNames = derived([widgets], ([$widgets]) => $widgets.map((w) => w.name))
  let name = derived([widgetNames], ([$widgetNames]) => getNextName($widgetNames, "Count"))

  export let onSuccess: () => void = () => {}

  const form = superForm(
    defaults(
      {
        tableId: $table.id.value,
        viewId,
        widget: WidgetVO.default($name).toJSON(),
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
      await invalidate(`undb:table:${$table.id.value}`)
      onSuccess()
    },
    onError(error, variables, context) {
      toast.error(error.message)
    },
  })
</script>

<form method="POST" use:enhance>
  <Form.Field {form} name="widget.name">
    <Form.Control let:attrs>
      <Form.Label>{$LL.widget.name()}</Form.Label>
      <Input {...attrs} bind:value={$formData.widget.name} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <!-- <Form.Field {form} name="widget.item.type">
    <Form.Control let:attrs>
      <Form.Label>Type</Form.Label>
      <WidgetTypePicker {...attrs} bind:value={$formData.widget.item.type} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field> -->

  <Button type="submit" variant="outline" disabled={$createViewWidgetMutation.isPending} class="w-full">
    {#if $createViewWidgetMutation.isPending}
      <Loader2 class="mr-2 h-4 w-4 animate-spin" />
    {:else}
      <PlugIcon class="mr-2 h-4 w-4" />
    {/if}
    {$LL.table.view.widget.add()}
  </Button>
</form>
