<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js"
  import { getTable } from "$lib/store/table.store"
  import { updateKanbanViewDTO, type KanbanView } from "@undb/table"
  import FieldPicker from "../field-picker/field-picker.svelte"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import CreateFieldButton from "../create-field/create-field-button.svelte"
  import { createMutation } from "@tanstack/svelte-query"
  import { toast } from "svelte-sonner"
  import { invalidate } from "$app/navigation"
  import { hasPermission } from "$lib/store/space-member.store"
  import { CircleCheckBigIcon } from "lucide-svelte"
  import { LL } from "@undb/i18n/client"
  import { getDataService } from "$lib/store/data-service.store"

  export let readonly = false

  const table = getTable()

  $: fields = $table.schema.getKanbanFields()

  export let view: KanbanView

  const form = superForm(
    defaults(
      {
        tableId: $table.id.value,
        viewId: view.id.value,
        type: "kanban",
        name: view.name.value,
        kanban: view.kanban.unwrapOrElse(() => ({ field: undefined })),
      },
      zodClient(updateKanbanViewDTO),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zodClient(updateKanbanViewDTO),
      resetForm: false,
      invalidateAll: false,
      onUpdate(event) {
        if (!event.form.valid) return

        $updateViewMutation.mutate(event.form.data)
      },
    },
  )

  const { enhance, form: formData } = form

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
  <form id="select-kanban-field-form" class="space-y-2" use:enhance>
    <div class="grid w-full items-center gap-4">
      <div class="flex flex-col space-y-1.5">
        <FieldPicker
          disabled={readonly}
          placeholder={$LL.table.view.kanban.groupBy()}
          value={$formData.kanban?.field}
          onValueChange={(field) => {
            if ($formData.kanban) {
              $formData.kanban.field = field
            } else {
              $formData.kanban = { field }
            }
          }}
          filter={(f) => fields.map((f) => f.id.value).includes(f.id)}
        />
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
        form="select-kanban-field-form"
        disabled={readonly}
      >
        <CircleCheckBigIcon class="mr-2 size-4" />
        {$LL.common.confirm()}
      </Button>
    </div>
  {/if}
</div>
