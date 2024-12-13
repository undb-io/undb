<script lang="ts">
  import { superForm } from "sveltekit-superforms/client"
  import { zodClient } from "sveltekit-superforms/adapters"
  import { Loader2 } from "lucide-svelte"
  import * as Form from "$lib/components/ui/form"
  import { Input } from "$lib/components/ui/input"
  import { addDashboardWidgetCommand, type IAddDashboardWidgetCommand } from "@undb/commands"
  import { defaults } from "sveltekit-superforms"
  import { PlugIcon } from "lucide-svelte"
  import { createMutation } from "@tanstack/svelte-query"
  import { derived } from "svelte/store"
  import { getNextName } from "@undb/utils"
  import { toast } from "svelte-sonner"
  import { getDashboard, getDashboardWidgetItemsStore } from "$lib/store/dashboard.store"
  import { DashboardWidget, DashboardLayouts, COLS } from "@undb/dashboard"
  import TablePicker from "../table-picker/table-picker.svelte"
  import { invalidate, invalidateAll } from "$app/navigation"
  import { LL } from "@undb/i18n/client"
  import { getDataService } from "$lib/store/data-service.store"
  import { getIsPlayground } from "$lib/store/playground.svelte"

  const dashboard = getDashboard()

  const dataService = getDataService()

  let widgets = derived([dashboard], ([$dashboard]) => $dashboard?.widgets.value ?? [])
  let widgetNames = derived([widgets], ([$widgets]) => $widgets.map((w) => w.widget.name))
  let name = derived([widgetNames], ([$widgetNames]) => getNextName($widgetNames, "Count"))

  export let onSuccess: () => void = () => {}

  const widgetItems = getDashboardWidgetItemsStore()
  const widget = widgetItems.add("aggregate")

  const layout = widget[COLS]
  const defaultLayout = DashboardLayouts.default()

  const form = superForm(
    defaults(
      {
        dashboardId: $dashboard.id.value,
        widget: DashboardWidget.default(undefined, $name).toJSON(),
        layout: {
          x: layout.x ?? defaultLayout.x,
          y: layout.y ?? defaultLayout.y,
          w: layout.w ?? defaultLayout.w,
          h: layout.h ?? defaultLayout.h,
        },
      },
      zodClient(addDashboardWidgetCommand),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zodClient(addDashboardWidgetCommand),
      taintedMessage: null,
      invalidateAll: false,
      onSubmit(input) {
        validateForm({ update: true })
      },
      onUpdate(event) {
        if (!event.form.valid) {
          console.log(event.form.errors)
          return
        }

        $addDashboardWidgetMutation.mutate(event.form.data)
      },
    },
  )

  const { form: formData, enhance, validateForm } = form

  const isPlayground = getIsPlayground()

  const addDashboardWidgetMutation = createMutation({
    mutationFn: dataService.dashboard.addWidget,
    async onSuccess(data) {
      onSuccess()
      if (isPlayground) {
        await invalidateAll()
      } else {
        await invalidate(`undb:dashboard:${$dashboard.id.value}`)
      }
      toast.success("Created")
    },
    onError(error, variables, context) {
      toast.error(error.message)
    },
  })
</script>

<form method="POST" use:enhance>
  <Form.Field {form} name="widget.widget.name">
    <Form.Control let:attrs>
      <Form.Label>{$LL.table.common.table()}</Form.Label>
      <TablePicker {...attrs} baseId={$dashboard.baseId} bind:value={$formData.widget.table.id} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="widget.widget.name">
    <Form.Control let:attrs>
      <Form.Label>{$LL.common.name()}</Form.Label>
      <Input {...attrs} class="text-xs" bind:value={$formData.widget.widget.name} />
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

  <Form.Button
    size="sm"
    type="submit"
    variant="outline"
    disabled={$addDashboardWidgetMutation.isPending}
    class="w-full"
  >
    {#if $addDashboardWidgetMutation.isPending}
      <Loader2 class="mr-2 h-4 w-4 animate-spin" />
    {:else}
      <PlugIcon class="mr-2 h-4 w-4" />
    {/if}
    {$LL.widget.add()}
  </Form.Button>
</form>

<!-- <SuperDebug data={$formData} /> -->
