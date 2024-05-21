<script lang="ts">
  import * as Form from "$lib/components/ui/form"
  import FieldIcon from "$lib/components/blocks/field-icon/field-icon.svelte"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import FieldControl from "../field-control/field-control.svelte"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import { toast } from "svelte-sonner"
  import { beforeNavigate } from "$app/navigation"
  import { queryParam, ssp } from "sveltekit-search-params"

  const r = queryParam("r", ssp.string(), { pushHistory: false })

  beforeNavigate(({ cancel }) => {
    if ($tainted) {
      if (!confirm("Are you sure you want to leave this page? You have unsaved changes that will be lost.")) {
        cancel()
      }
    }
  })

  const table = getTable()
  const schema = $table.schema.mutableSchema

  export let disabled: boolean = false
  export let dirty = false

  const client = useQueryClient()

  const updateRecordMutation = createMutation({
    mutationFn: trpc.record.update.mutate,
    onSettled: () => {
      $r = ""
      client.invalidateQueries({ queryKey: ["records", $table.id.value] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const updateRecord = (values: any) => {
    $updateRecordMutation.mutate({
      tableId: $table.id.value,
      id: $r,
      values,
    })
  }

  const form = superForm(defaults({}, zodClient(schema)), {
    SPA: true,
    dataType: "json",
    validators: zodClient(schema),
    resetForm: false,
    invalidateAll: false,
    onUpdate(event) {
      if (!event.form.valid) return

      updateRecord(event.form.data)
    },
  })

  const { form: formData, enhance, allErrors, tainted } = form

  $: dirty = !!$tainted
  $: disabled = !$tainted || !!$allErrors.length

  $: fields = $table.getOrderedFields()
</script>

<form method="POST" use:enhance id="createRecord">
  {#each fields as field}
    <Form.Field {form} name={field.id.value}>
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
        <FieldControl {...attrs} bind:value={$formData[field.id.value]} {field} disabled={field.isSystem} />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
  {/each}
</form>

<!-- <SuperDebug data={$formData} /> -->
