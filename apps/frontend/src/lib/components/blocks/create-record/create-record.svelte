<script lang="ts">
  import * as Form from "$lib/components/ui/form"
  import FieldIcon from "$lib/components/blocks/field-icon/field-icon.svelte"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import FieldControl from "../field-control/field-control.svelte"
  import type { SuperValidated } from "sveltekit-superforms"
  import { superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import { createRecordSheetOpen } from "./create-record.store"

  const table = getTable()
  const schema = $table.schema.valuesSchema

  export let data: SuperValidated<any>

  const client = useQueryClient()

  const createRecordMutation = createMutation({
    mutationFn: trpc.record.create.mutate,
    onSettled: () => {
      $createRecordSheetOpen = false
      client.invalidateQueries({ queryKey: ["records", $table.id.value] })
    },
  })

  const createRecord = (values: any) => {
    $createRecordMutation.mutate({
      tableId: $table.id.value,
      values,
    })
  }

  const form = superForm(data, {
    SPA: true,
    dataType: "json",
    // @ts-ignore
    validators: zodClient(schema),
    resetForm: false,
    invalidateAll: false,
    onSubmit() {
      createRecord($formData)
    },
  })

  const { form: formData, enhance } = form
</script>

<form method="POST" use:enhance id="createRecord">
  {#each $table.schema.fields as field}
    <Form.Field {form} name={field.id.value}>
      <Form.Control let:attrs>
        <Form.Label class="flex items-center gap-2">
          <FieldIcon type={field.type} class="h-4 w-4" />
          <span>{field.name.value}</span>
          {#if field.required}
            <span class="text-red-500">*</span>
          {/if}
        </Form.Label>
        <FieldControl {...attrs} bind:value={$formData[field.id.value]} {field} />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
  {/each}
</form>

<!-- <SuperDebug data={$formData} /> -->
