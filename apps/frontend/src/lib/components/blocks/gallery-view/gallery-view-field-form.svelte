<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js"
  import { getTable } from "$lib/store/table.store"
  import { updateGalleryViewDTO, type GalleryView } from "@undb/table"
  import FieldPicker from "../field-picker/field-picker.svelte"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import CreateFieldButton from "../create-field/create-field-button.svelte"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { toast } from "svelte-sonner"
  import { invalidate } from "$app/navigation"
  import { CircleCheckBigIcon } from "lucide-svelte"
  import { LL } from "@undb/i18n/client"
  import { getDataService } from "$lib/store/data-service.store"
  import { type IUpdateViewCommand } from "@undb/commands"

  const table = getTable()
  export let readonly = false

  $: fields = $table.schema.getGalleryFields()

  export let view: GalleryView

  const form = superForm(
    defaults(
      {
        tableId: $table.id.value,
        viewId: view.id.value,
        type: "gallery",
        name: view.name.value,
        gallery: view.gallery.unwrapOrElse(() => ({ field: undefined })),
      },
      zodClient(updateGalleryViewDTO),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zodClient(updateGalleryViewDTO),
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
  <form id="select-gallery-field-form" class="space-y-2" use:enhance>
    <div class="grid w-full items-center gap-4">
      <div class="flex flex-col space-y-1.5">
        <FieldPicker
          placeholder={$LL.table.view.gallery.groupBy()}
          value={$formData.gallery?.field}
          disabled={readonly}
          onValueChange={(field) => {
            if ($formData.gallery) {
              $formData.gallery.field = field
            } else {
              $formData.gallery = { field }
            }
          }}
          filter={(f) => fields.map((f) => f.id.value).includes(f.id)}
        />
      </div>
    </div>
  </form>

  {#if !readonly}
    <CreateFieldButton class="w-full" variant="secondary" />

    <div class="flex w-full justify-end">
      <Button
        variant="outline"
        disabled={readonly}
        size="sm"
        class="w-full"
        type="submit"
        form="select-gallery-field-form"
      >
        <CircleCheckBigIcon class="mr-2 size-4" />
        {$LL.common.confirm()}
      </Button>
    </div>
  {/if}
</div>
