<script lang="ts">
  import * as Form from "$lib/components/ui/form"
  import FieldIcon from "$lib/components/blocks/field-icon/field-icon.svelte"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import FieldControl from "../field-control/field-control.svelte"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import { createRecordSheetOpen } from "./create-record.store"
  import { toast } from "svelte-sonner"
  import { ShieldCheckIcon } from "lucide-svelte"
  import { beforeNavigate } from "$app/navigation"

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

  const createRecordMutation = createMutation({
    mutationFn: trpc.record.create.mutate,
    onSettled: () => {
      $createRecordSheetOpen = false
      client.invalidateQueries({ queryKey: ["records", $table.id.value] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const createRecord = (values: any) => {
    $createRecordMutation.mutate({
      tableId: $table.id.value,
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

      createRecord(event.form.data)
    },
  })

  const { form: formData, enhance, allErrors, tainted } = form

  $: dirty = !!$tainted
  $: disabled = !$tainted || !!$allErrors.length

  $: fields = $table.getOrderedFields().filter((f) => f.isMutable)
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
          <ShieldCheckIcon class="text-muted-foreground h-4 w-4" />
        </Form.Label>
        <FieldControl {...attrs} bind:value={$formData[field.id.value]} {field} disabled={field.isSystem} />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
  {/each}
</form>

<!-- <SuperDebug data={$formData} /> -->
