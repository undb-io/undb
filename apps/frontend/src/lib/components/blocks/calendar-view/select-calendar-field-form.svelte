<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js"
  import { getTable } from "$lib/store/table.store"
  import { updateCalendarViewDTO, type CalendarView } from "@undb/table"
  import FieldPicker from "../field-picker/field-picker.svelte"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import CreateFieldButton from "../create-field/create-field-button.svelte"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { toast } from "svelte-sonner"
  import { invalidate } from "$app/navigation"
  import { hasPermission } from "$lib/store/space-member.store"
  import { CircleCheckBigIcon } from "lucide-svelte"
  import * as Form from "$lib/components/ui/form"
  import { LL } from "@undb/i18n/client"
  import { getDataService } from "$lib/store/data-service.store"

  export let readonly = false

  const table = getTable()

  $: fields = $table.schema.getCalendarFields()

  export let view: CalendarView

  let calendar = view.calendar.unwrapOrElse(() => ({ field: undefined, timeScale: "month" }))

  const form = superForm(
    defaults(
      {
        tableId: $table.id.value,
        viewId: view.id.value,
        type: "calendar",
        name: view.name.value,
        calendar: {
          ...calendar,
          timeScale: calendar.timeScale ?? "month",
        },
      },
      zodClient(updateCalendarViewDTO),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zodClient(updateCalendarViewDTO),
      resetForm: false,
      invalidateAll: false,
      onSubmit(event) {
        validateForm({ update: true })
      },
      onUpdate(event) {
        if (!event.form.valid) {
          console.log(event.form.errors, event.form.data)
          return
        }

        $updateViewMutation.mutate(event.form.data)
      },
    },
  )

  const { enhance, form: formData, validateForm } = form

  const dataService = getDataService()

  const updateViewMutation = createMutation({
    mutationFn: dataService.table.view.updateView,
    mutationKey: ["updateView"],
    async onSuccess(data, variables, context) {
      toast.success($LL.table.view.updated())
      await invalidate(`undb:table:${$table.id.value}`)
    },
  })
</script>

<div class="space-y-2">
  <form id="select-calendar-field-form" class="space-y-2" use:enhance>
    <div class="grid w-full items-center gap-4">
      <div class="flex flex-col space-y-1.5">
        <Form.Field {form} name="calendar.field">
          <Form.Control let:attrs>
            <Form.Label for="calendar.field">Calendar field</Form.Label>
            <FieldPicker
              disabled={readonly}
              placeholder={$LL.table.view.calendar.select()}
              class="w-full"
              value={$formData.calendar?.field}
              onValueChange={(field) => {
                if ($formData.calendar) {
                  $formData.calendar.field = field
                } else {
                  $formData.calendar = { field }
                }
              }}
              filter={(f) => fields.map((f) => f.id.value).includes(f.id)}
            />
          </Form.Control>
          <Form.Description />
          <Form.FieldErrors />
        </Form.Field>
      </div>
    </div>
  </form>

  {#if !readonly && $hasPermission("field:update")}
    <CreateFieldButton class="w-full" variant="secondary" />
  {/if}

  {#if !readonly}
    <div class="flex w-full justify-end">
      <Button
        variant="outline"
        size="sm"
        class="w-full"
        type="submit"
        form="select-calendar-field-form"
        disabled={readonly}
      >
        <CircleCheckBigIcon class="mr-2 size-4" />
        {$LL.common.confirm()}
      </Button>
    </div>
  {/if}
</div>
