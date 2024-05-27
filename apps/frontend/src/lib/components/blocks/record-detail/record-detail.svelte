<script lang="ts">
  import { RecordDO } from "@undb/table"
  import * as Form from "$lib/components/ui/form"
  import FieldIcon from "$lib/components/blocks/field-icon/field-icon.svelte"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import FieldControl from "../field-control/field-control.svelte"
  import FieldValue from "../field-value/field-value.svelte"
  import SuperDebug, { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import { toast } from "svelte-sonner"
  import { beforeNavigate } from "$app/navigation"
  import { keys, pick } from "radash"
  import { queryParam } from "sveltekit-search-params"

  const r = queryParam("r")

  export let record: RecordDO

  beforeNavigate(({ cancel }) => {
    if ($tainted) {
      if (!confirm("Are you sure you want to leave this page? You have unsaved changes that will be lost.")) {
        cancel()
      }
    }
  })

  const table = getTable()
  const schema = $table.schema.mutableSchema
  $: fields = $table.getOrderedFields()

  export let disabled: boolean = false
  export let dirty = false

  const client = useQueryClient()

  const updateRecordMutation = createMutation({
    mutationFn: trpc.record.update.mutate,
    onSuccess: async () => {
      toast.success("Record updated")
      $r = null
      reset({})
      await client.invalidateQueries({ queryKey: ["records", $table.id.value] })
      await client.invalidateQueries({ queryKey: [record.id.value, "get"] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  $: record, reset({ newState: record.flatten() })
  const values = record.flatten()

  const updateRecord = (values: any) => {
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
      if (!event.form.valid) return

      const data = event.form.data
      const values = $tainted ? pick(data, keys($tainted)) : undefined
      if (values) {
        updateRecord(values)
      }
    },
  })

  const { form: formData, enhance, allErrors, tainted, reset } = form

  $: dirty = !!$tainted
  $: disabled = !$tainted || !!$allErrors.length
</script>

<form method="POST" use:enhance id="updateRecord" class="space-y-4">
  {#each fields as field}
    {@const dirty = $tainted && $tainted[field.id.value]}
    <Form.Field {form} name={field.id.value}>
      <Form.Control let:attrs>
        <Form.Label class="flex h-4 items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <FieldIcon type={field.type} class="h-4 w-4" />
            <span>{field.name.value}</span>
            {#if field.required}
              <span class="text-red-500">*</span>
            {/if}
            {#if dirty}
              <span
                class="me-2 rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300"
                >updated</span
              >
            {/if}
          </div>
        </Form.Label>
        {#if field.isSystem}
          <div class="py-3 text-sm">
            <FieldValue value={values[field.id.value]} type={field.type} />
          </div>
        {:else}
          <FieldControl {...attrs} bind:value={$formData[field.id.value]} {field} />
        {/if}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
  {/each}
</form>

<!-- <SuperDebug data={$formData} /> -->
