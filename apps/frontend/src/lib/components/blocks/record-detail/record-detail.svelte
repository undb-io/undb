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
  import { queryParam } from "sveltekit-search-params"
  import type { Readable } from "svelte/store"
  import * as Collapsible from "$lib/components/ui/collapsible"
  import Button from "$lib/components/ui/button/button.svelte"
  import { preferences } from "$lib/store/persisted.store"
  import { cn } from "$lib/utils"

  export let readonly = false

  const r = queryParam("r")

  export let record: RecordDO

  beforeNavigate(({ cancel }) => {
    if ($tainted) {
      if (!confirm("Are you sure you want to leave this page? You have unsaved changes that will be lost.")) {
        cancel()
      }
    }
  })

  export let onSuccess: () => void = () => {}

  export let table: Readable<TableDo>
  const fields = $table.getOrderedVisibleFields()
  const schema = $table.schema.getMutableSchema(fields)

  export let disabled: boolean = false
  export let dirty = false

  const client = useQueryClient()

  const updateRecordMutation = createMutation({
    mutationFn: trpc.record.update.mutate,
    onSuccess: async () => {
      toast.success("Record updated")
      onSuccess()
      reset({})
      await client.invalidateQueries({ queryKey: [record.id.value, "get"] })
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

  const { form: formData, enhance, allErrors, tainted, reset, errors } = form

  $: dirty = !!$tainted
  $: disabled = !$tainted || !!$allErrors.length

  $: hiddenFields = $table.getOrderedHiddenFields()
</script>

<form
  method="POST"
  use:enhance
  id={`${$table.id.value}:updateRecord`}
  class="my-4 space-y-8"
  enctype="multipart/form-data"
>
  {#each fields as field}
    {@const dirty = $tainted && $tainted[field.id.value]}
    <Form.Field class="flex gap-4 space-y-0" {form} name={field.id.value}>
      <Form.Control let:attrs>
        <Form.Label class="text-muted-foreground flex h-4 w-48 items-center justify-between gap-2 pt-2">
          <div class="flex items-center gap-2">
            <FieldIcon {field} type={field.type} class="h-4 w-4" />
            <span class="flex-1 truncate">{field.name.value}</span>
            {#if field.required}
              <span class="text-red-500">*</span>
            {/if}
            {#if dirty}
              <span
                class="me-2 rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300"
              >
                updated
              </span>
            {/if}
          </div>
        </Form.Label>
        <div class="flex-1">
          {#if field.isSystem}
            <FieldValue
              {field}
              tableId={$table.id.value}
              recordId={record.id.value}
              value={values[field.id.value]}
              type={field.type}
              displayValue={displayValues[field.id.value]}
              class="text-xs"
            />
          {:else}
            <FieldControl
              {...attrs}
              bind:value={$formData[field.id.value]}
              {field}
              tableId={$table.id.value}
              recordId={$r}
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
    <Collapsible.Root bind:open={$preferences.showHiddenFields} class="my-4">
      <div class="flex w-full items-center gap-1">
        <div class="h-[1px] flex-1 bg-gray-100"></div>
        <Collapsible.Trigger asChild let:builder>
          <Button builders={[builder]} variant="outline" size="sm" class="text-muted-foreground">
            Show {hiddenFields.length} hidden fields
          </Button>
        </Collapsible.Trigger>
        <div class="h-[1px] flex-1 bg-gray-100"></div>
      </div>
      <Collapsible.Content class="mt-4 space-y-8">
        {#each hiddenFields as field}
          {@const dirty = $tainted && $tainted[field.id.value]}
          <Form.Field class="flex gap-4 space-y-0" {form} name={field.id.value}>
            <Form.Control let:attrs>
              <Form.Label class="text-muted-foreground flex h-4 w-48 items-center justify-between gap-2 pt-2">
                <div class="flex items-center gap-2">
                  <FieldIcon {field} type={field.type} class="h-4 w-4" />
                  <span class="flex-1 truncate">{field.name.value}</span>
                  {#if field.required}
                    <span class="text-red-500">*</span>
                  {/if}
                  {#if dirty}
                    <span
                      class="me-2 rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300"
                    >
                      updated
                    </span>
                  {/if}
                </div>
              </Form.Label>
              <div class="flex-1">
                {#if field.isSystem}
                  <FieldValue
                    {field}
                    tableId={$table.id.value}
                    recordId={record.id.value}
                    value={values[field.id.value]}
                    type={field.type}
                    displayValue={displayValues[field.id.value]}
                    class="text-xs"
                  />
                {:else}
                  <FieldControl
                    {...attrs}
                    bind:value={$formData[field.id.value]}
                    {field}
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
