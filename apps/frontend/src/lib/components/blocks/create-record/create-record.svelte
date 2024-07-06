<script lang="ts">
  import * as Form from "$lib/components/ui/form"
  import FieldIcon from "$lib/components/blocks/field-icon/field-icon.svelte"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import FieldControl from "../field-control/field-control.svelte"
  import SuperDebug, { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import { toast } from "svelte-sonner"
  import { beforeNavigate } from "$app/navigation"
  import { derived, type Readable, type Writable } from "svelte/store"
  import { FormIdVO, RecordDO, RecordIdVO, TableDo } from "@undb/table"
  import { CREATE_RECORD_MODAL, closeModal } from "$lib/store/modal.store"
  import autoAnimate from "@formkit/auto-animate"

  // beforeNavigate(({ cancel }) => {
  //   if ($tainted) {
  //     if (!confirm("Are you sure you want to leave this page? You have unsaved changes that will be lost.")) {
  //       cancel()
  //     }
  //   }
  // })

  export let table: Readable<TableDo>
  const schema = $table.schema.getMutableSchema()

  export let disabled: boolean = false
  export let dirty = false
  export let formId: string | undefined = undefined
  export let onSuccess: (id: string) => void = () => {}

  $: tableForm = formId ? $table.forms?.getFormById(formId) : undefined

  const client = useQueryClient()

  const createRecordMutation = createMutation(
    derived([table], ([$table]) => ({
      mutationFn: trpc.record.create.mutate,
      onSuccess: (data) => {
        client.invalidateQueries({
          queryKey: ["records", $table.id.value],
        })
        toast.success("Record has been created!")
        onSuccess?.(data)
      },
      onError: (error: Error) => {
        toast.error(error.message)
      },
    })),
  )

  const createRecord = (values: any) => {
    $createRecordMutation.mutate({
      tableId: $table.id.value,
      values,
    })
  }

  const defaultValue = $table.getDefaultValues(formId ? new FormIdVO(formId) : undefined)
  $: $table, form.reset({ data: $table.getDefaultValues(formId ? new FormIdVO(formId) : undefined) })

  const form = superForm(defaults(defaultValue, zodClient(schema)), {
    SPA: true,
    dataType: "json",
    // validators: zodClient(schema),
    resetForm: false,
    invalidateAll: false,
    onUpdate(event) {
      if (!event.form.valid) return

      createRecord(event.form.data)
    },
  })

  const { form: formData, enhance, allErrors, tainted } = form

  $: dirty = !!$tainted
  $: disabled = !!$allErrors.length

  $: fields = $table.getOrderedMutableFields(formId ? new FormIdVO(formId) : undefined)

  $: tempRecord = RecordDO.fromJSON($table, { id: RecordIdVO.create().value, values: $formData })
</script>

<form method="POST" use:enhance id="createRecord" enctype="multipart/form-data" class="my-4 space-y-4">
  <ul use:autoAnimate class="space-y-2">
    {#each fields as field}
      {@const shouldShow =
        !tableForm || tableForm.getShouldShowField(field.id.value, $table.schema.fieldMapById, tempRecord)}
      {#if shouldShow}
        <Form.Field class="rounded-sm border p-2" {form} name={field.id.value}>
          <Form.Control let:attrs>
            <Form.Label class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <FieldIcon type={field.type} class="h-4 w-4" />
                <span>{field.name.value}</span>
                {#if field.required}
                  <span class="text-red-500">*</span>
                {/if}
              </div>
            </Form.Label>
            <FieldControl
              {...attrs}
              bind:value={$formData[field.id.value]}
              tableId={$table.id.value}
              {field}
              disabled={field.isSystem}
            />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
      {/if}
    {/each}
  </ul>
</form>

<!-- <SuperDebug data={$formData} /> -->
