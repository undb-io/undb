<script lang="ts">
  import { RecordDO, TableDo } from "@undb/table"
  import * as Form from "$lib/components/ui/form"
  import FieldIcon from "$lib/components/blocks/field-icon/field-icon.svelte"
  import { trpc } from "$lib/trpc/client"
  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import FieldControl from "../field-control/field-control.svelte"
  import FieldValue from "../field-value/field-value.svelte"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import { toast } from "svelte-sonner"
  import { beforeNavigate } from "$app/navigation"
  import { pick } from "radash"
  import * as Collapsible from "$lib/components/ui/collapsible"
  import Button from "$lib/components/ui/button/button.svelte"
  import { preferences } from "$lib/store/persisted.store"
  import { cn } from "$lib/utils"
  import { getRecordsStore } from "$lib/store/records.store"
  import { type Writable, type Readable } from "svelte/store"
  import { LL } from "@undb/i18n/client"
  import { getDataService } from "$lib/store/data-service.store"

  const recordsStore = getRecordsStore()

  export let readonly = false
  export let r: Writable<string | null>
  export let record: RecordDO
  export let viewId: Readable<string | undefined>

  const dataService = getDataService()

  beforeNavigate(({ cancel }) => {
    if (mutableFieldTainted) {
      if (!confirm("Are you sure you want to leave this page? You have unsaved changes that will be lost.")) {
        cancel()
      }
    }
  })

  export let onSuccess: () => void = () => {}

  export let table: Readable<TableDo>
  const fields = $table.getOrderedVisibleFields($viewId).filter((f) => f.type !== "button")
  const schema = $table.schema.getMutableSchema(fields)

  export let disabled: boolean = false
  export let dirty = false

  const client = useQueryClient()

  const updateRecordMutation = createMutation({
    mutationFn: dataService.records.updateRecord,
    mutationKey: ["updateRecord"],
    onSuccess: async () => {
      toast.success("Record updated")
      onSuccess()
      await client.invalidateQueries({ queryKey: [record.id.value, "get"] })
      reset({})
      await recordsStore?.invalidateRecord(dataService, $table, record.id.value)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  $: record, reset({ newState: record.flatten() })
  const values = record.flatten()
  $: displayValues = record.displayValues?.toJSON() ?? {}

  const updateRecord = (values: any) => {
    if (readonly) return
    const recordId = record.id.value

    $updateRecordMutation.mutate({
      tableId: $table.id.value,
      id: recordId,
      values,
    })
  }

  const form = superForm(defaults(values, zodClient(schema)), {
    SPA: true,
    dataType: "json",
    validators: zodClient(schema),
    resetForm: false,
    invalidateAll: false,
    onSubmit(input) {
      validateForm({ update: true })
    },
    onChange(event) {
      validateForm({ update: true })
    },
    onUpdate(event) {
      if (!event.form.valid) {
        return
      }

      const data = event.form.data
      const values = $tainted ? pick(data, Object.keys($tainted)) : undefined
      if (values) {
        updateRecord(values)
      }
    },
  })

  const { form: formData, enhance, allErrors, tainted, reset, errors, validateForm } = form

  $: mutableFields = fields.filter((f) => f.isMutable)
  $: taintedKeys = Object.keys($tainted ?? {})
  $: mutableFieldTainted = taintedKeys.some((key) => mutableFields.some((f) => f.id.value === key))
  $: dirty = mutableFieldTainted
  $: disabled = !$tainted || !!$allErrors.length

  $: hiddenFields = $table.getOrderedHiddenFields($viewId).filter((f) => f.type !== "button")
</script>

<form
  method="POST"
  use:enhance
  id={`${$table.id.value}:updateRecord`}
  class="my-4 space-y-4"
  enctype="multipart/form-data"
>
  {#each fields as field}
    {@const dirty = $tainted && $tainted[field.id.value]}
    <Form.Field class="space-y-2" {form} name={field.id.value}>
      <Form.Control let:attrs>
        <Form.Label class="h-full w-48 shrink-0 space-y-2 truncate font-medium leading-none">
          <div class="flex items-center gap-1">
            <FieldIcon {field} type={field.type} class="size-3" />
            <span class="truncate text-sm">{field.name.value}</span>
            {#if field.required}
              <span class="text-red-500">*</span>
            {/if}
            {#if dirty && field.isMutable}
              <span
                class="me-2 rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium uppercase text-green-800 dark:bg-green-900 dark:text-green-300"
              >
                {$LL.common.updated()}
              </span>
            {/if}
          </div>
        </Form.Label>
        <div class="min-h-9 flex-1">
          {#if field.isSystem || !field.isMutable}
            <FieldValue
              {r}
              {field}
              tableId={$table.id.value}
              recordId={record.id.value}
              value={values[field.id.value]}
              type={field.type}
              displayValue={displayValues[field.id.value]}
              class="flex min-h-9 items-center truncate text-xs"
              readonly
            />
          {:else}
            <FieldControl
              {...attrs}
              bind:value={$formData[field.id.value]}
              {field}
              tableId={$table.id.value}
              recordId={$r}
              {r}
              {record}
              displayValue={displayValues[field.id.value]}
              {readonly}
              class={cn($errors[field.id.value] && "border-red-500 focus-visible:ring-0")}
            />
            <Form.FieldErrors class="mt-2" />
          {/if}
        </div>
      </Form.Control>
    </Form.Field>
  {/each}

  {#if hiddenFields.length}
    <Collapsible.Root bind:open={$preferences.showHiddenFields} class="my-4 w-full">
      <div class="flex w-full items-center gap-1">
        <div class="h-[1px] flex-1 bg-gray-100"></div>
        <Collapsible.Trigger asChild let:builder>
          <Button builders={[builder]} variant="outline" size="sm" class="text-muted-foreground">
            {#if $preferences.showHiddenFields}
              {$LL.table.record.hideHiddenFields({ n: hiddenFields.length })}
            {:else}
              {$LL.table.record.showHiddenFields({ n: hiddenFields.length })}
            {/if}
          </Button>
        </Collapsible.Trigger>
        <div class="h-[1px] flex-1 bg-gray-100"></div>
      </div>
      <Collapsible.Content class="mt-4 space-y-4">
        {#each hiddenFields as field}
          {@const dirty = $tainted && $tainted[field.id.value]}
          <Form.Field class="space-y-2" {form} name={field.id.value}>
            <Form.Control let:attrs>
              <Form.Label class="h-full w-48 shrink-0 space-y-2">
                <div class="flex items-center gap-1">
                  <FieldIcon {field} type={field.type} class="size-3" />
                  <span class="truncate text-sm">{field.name.value}</span>
                  {#if field.required}
                    <span class="text-red-500">*</span>
                  {/if}
                  {#if dirty}
                    <span
                      class="me-2 rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium uppercase text-green-800 dark:bg-green-900 dark:text-green-300"
                    >
                      {$LL.common.updated()}
                    </span>
                  {/if}
                </div>
              </Form.Label>
              <div class="flex-1">
                {#if field.isSystem || !field.isMutable}
                  <FieldValue
                    {r}
                    {field}
                    tableId={$table.id.value}
                    recordId={record.id.value}
                    value={values[field.id.value]}
                    type={field.type}
                    displayValue={displayValues[field.id.value]}
                    class="min-h-9 text-xs"
                    readonly
                  />
                {:else}
                  <FieldControl
                    {...attrs}
                    bind:value={$formData[field.id.value]}
                    {field}
                    {r}
                    tableId={$table.id.value}
                    recordId={$r}
                    displayValue={displayValues[field.id.value]}
                    {readonly}
                  />
                {/if}
              </div>
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
        {/each}
      </Collapsible.Content>
    </Collapsible.Root>
  {/if}
</form>

<!-- <SuperDebug data={$formData} /> -->
