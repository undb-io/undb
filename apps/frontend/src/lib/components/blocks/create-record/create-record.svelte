<script lang="ts">
  import * as Form from "$lib/components/ui/form"
  import FieldIcon from "$lib/components/blocks/field-icon/field-icon.svelte"
  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import FieldControl from "../field-control/field-control.svelte"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import { toast } from "svelte-sonner"
  import { derived, type Readable } from "svelte/store"
  import { FormIdVO, ID_TYPE, RecordDO, RecordIdVO, TableDo } from "@undb/table"
  import autoAnimate from "@formkit/auto-animate"
  import { cn } from "$lib/utils"
  import { defaultRecordValues, getRecordsStore } from "$lib/store/records.store"
  import { useMediaQuery } from "$lib/store/media-query.store"
  import IdControl from "../field-control/id-control.svelte"
  import type { ICreateRecordCommand, ICreateRecordCommandOutput } from "@undb/commands"
  import { onMount } from "svelte"
  import { LL } from "@undb/i18n/client"
  import { getDataService } from "$lib/store/data-service.store"

  // beforeNavigate(({ cancel }) => {
  //   if ($tainted) {
  //     if (!confirm("Are you sure you want to leave this page? You have unsaved changes that will be lost.")) {
  //       cancel()
  //     }
  //   }
  // })

  const recordsStore = getRecordsStore()
  export let table: Readable<TableDo>
  const schema = $table.schema.getMutableSchema()

  export let disabled: boolean = false
  export let dirty = false
  export let formId: string | undefined = undefined
  export let onSuccess: (id: string) => void = () => {}

  $: tableForm = formId ? $table.forms?.getFormById(formId) : undefined

  const client = useQueryClient()

  const mediaQuery = useMediaQuery("(max-width: 768px)")
  const dataService = getDataService()

  const createRecordMutation = createMutation(
    derived([table], ([$table]) => ({
      mutationFn: dataService.records.createRecord,
      mutationKey: [$table.id.value, "createRecord"],
      onSuccess: (data: ICreateRecordCommandOutput) => {
        client.invalidateQueries({
          queryKey: ["records", $table.id.value],
        })
        toast.success($LL.table.record.createdRecord())
        onSuccess?.(data)
        recordsStore?.invalidateRecord(dataService, $table, data)
      },
      onError: (error: Error) => {
        toast.error(error.message)
      },
    })),
  )

  const createRecord = ({ id, ...values }: any) => {
    $createRecordMutation.mutate({
      tableId: $table.id.value,
      id,
      values,
    })
  }

  let defaultValue: any = {}

  function setDefaultValue() {
    defaultValue = {
      ...$table.getDefaultValues(formId ? new FormIdVO(formId) : undefined, $defaultRecordValues ?? undefined),
      [ID_TYPE]: null,
    }
    form.reset({ data: defaultValue })
  }

  $: if ($defaultRecordValues) {
    setDefaultValue()
  }

  onMount(() => {
    setDefaultValue()
  })

  const form = superForm(defaults(defaultValue, zodClient(schema)), {
    SPA: true,
    dataType: "json",
    validators: zodClient(schema),
    resetForm: false,
    invalidateAll: false,
    onSubmit(event) {
      validateForm({ update: true })
    },
    // onChange(event) {
    //   validateForm({ update: true })
    // },
    onUpdate(event) {
      if (!event.form.valid) {
        console.log(event.form.errors)
        console.log(event.form.data)
        return
      }

      createRecord(event.form.data)
    },
  })

  const { form: formData, enhance, allErrors, tainted, errors, validateForm } = form

  $: dirty = !!$tainted
  $: disabled = !!$allErrors.length

  $: fields = $table
    .getOrderedMutableFields(formId ? new FormIdVO(formId) : undefined)
    // TODO: get creatable fields
    .filter((f) => f.type !== "button")

  $: idField = $table.schema.getIdField()

  $: tempRecord = RecordDO.fromJSON($table, { id: RecordIdVO.create().value, values: $formData })
</script>

<form method="POST" use:enhance id="createRecord" enctype="multipart/form-data" class="my-4 space-y-4 px-6">
  <ul use:autoAnimate class={cn("space-y-4", $mediaQuery ? "space-y-2" : "space-y-4")}>
    {#if idField}
      <Form.Field class={cn("space-y-2", $mediaQuery ? "space-y-2" : "")} {form} name={ID_TYPE}>
        <Form.Control let:attrs>
          <Form.Label class="h-full w-48 space-y-2">
            <div data-field-id={ID_TYPE} class="flex items-center gap-1">
              <FieldIcon type={ID_TYPE} class="size-3" />
              <span class="text-sm">ID</span>
            </div>
          </Form.Label>
          <div class="min-h-9 flex-1">
            <IdControl
              {...attrs}
              bind:value={$formData[ID_TYPE]}
              tableId={$table.id.value}
              field={idField}
              class={cn($errors[ID_TYPE] && "border-red-500 focus-visible:ring-0")}
              tabIndex={-1}
              placeholder={$LL.table.field.id.placeholder()}
            />
            <Form.FieldErrors class="mt-2" />
          </div>
        </Form.Control>
      </Form.Field>
    {/if}
    {#each fields as field}
      {@const shouldShow = !tableForm || tableForm.getShouldShowField(field.id.value, $table.schema, tempRecord)}
      {#if shouldShow}
        <Form.Field class={cn("space-y-2", $mediaQuery ? "space-y-2" : "")} {form} name={field.id.value}>
          <Form.Control let:attrs>
            <Form.Label class="h-full w-48 space-y-2">
              <div data-field-id={field.id.value} class="flex items-center gap-1">
                <FieldIcon {field} type={field.type} class="size-3" />
                <span class="truncate text-sm">{field.name.value}</span>
                {#if field.required}
                  <span class="text-red-500">*</span>
                {/if}
              </div>
            </Form.Label>
            <div class="min-h-9 flex-1">
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
