<script lang="ts">
  import * as Form from "$lib/components/ui/form"
  import FieldIcon from "$lib/components/blocks/field-icon/field-icon.svelte"
  import { trpc } from "$lib/trpc/client"
  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import FieldControl from "../field-control/field-control.svelte"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import { toast } from "svelte-sonner"
  import { derived, type Readable } from "svelte/store"
  import { FormIdVO, RecordDO, RecordIdVO, TableDo } from "@undb/table"
  import autoAnimate from "@formkit/auto-animate"
  import { cn } from "$lib/utils"
  import { defaultRecordValues, recordsStore } from "$lib/store/records.store"

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
      mutationKey: [$table.id.value, "createRecord"],
      onSuccess: (data) => {
        client.invalidateQueries({
          queryKey: ["records", $table.id.value],
        })
        toast.success("Record has been created!")
        onSuccess?.(data)
        recordsStore.invalidateRecord($table, data)
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

  $: defaultValue = $table.getDefaultValues(
    formId ? new FormIdVO(formId) : undefined,
    $defaultRecordValues ?? undefined,
  )

  const form = superForm(defaults(defaultValue, zodClient(schema)), {
    SPA: true,
    dataType: "json",
    validators: zodClient(schema),
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

      createRecord(event.form.data)
    },
  })

  const { form: formData, enhance, allErrors, tainted, errors, validateForm } = form

  $: defaultValue, form.reset({ data: defaultValue })

  $: dirty = !!$tainted
  $: disabled = !!$allErrors.length

  $: fields = $table
    .getOrderedMutableFields(formId ? new FormIdVO(formId) : undefined)
    // TODO: get creatable fields
    .filter((f) => f.type !== "button")

  $: tempRecord = RecordDO.fromJSON($table, { id: RecordIdVO.create().value, values: $formData })
</script>

<form method="POST" use:enhance id="createRecord" enctype="multipart/form-data" class="my-4 space-y-4">
  <ul use:autoAnimate class="space-y-4">
    {#each fields as field}
      {@const shouldShow = !tableForm || tableForm.getShouldShowField(field.id.value, $table.schema, tempRecord)}
      {#if shouldShow}
        <Form.Field class="flex gap-4 space-y-0" {form} name={field.id.value}>
          <Form.Control let:attrs>
            <Form.Label class="flex h-4 w-48 items-center justify-between gap-2 pt-4">
              <div data-field-id={field.id.value} class="flex items-center gap-2">
                <FieldIcon {field} type={field.type} class="h-4 w-4" />
                <span>{field.name.value}</span>
                {#if field.required}
                  <span class="text-red-500">*</span>
                {/if}
              </div>
            </Form.Label>
            <div class="h-9 flex-1">
              <FieldControl
                {...attrs}
                bind:value={$formData[field.id.value]}
                tableId={$table.id.value}
                {field}
                disabled={field.isSystem}
                class={cn($errors[field.id.value] && "border-red-500 focus-visible:ring-0")}
              />
              <Form.FieldErrors class="mt-2" />
            </div>
          </Form.Control>
        </Form.Field>
      {/if}
    {/each}
  </ul>
</form>

<!-- <SuperDebug data={$formData} /> -->
