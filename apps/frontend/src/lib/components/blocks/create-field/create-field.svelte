<script lang="ts">
  import { invalidate } from "$app/navigation"
  import { Button } from "$lib/components/ui/button"
  import * as Form from "$lib/components/ui/form"
  import { Input } from "$lib/components/ui/input"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { createDefaultFieldDTO, createFieldDTO, type FieldType } from "@undb/table"
  import { toast } from "svelte-sonner"
  import { derived } from "svelte/store"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import FieldOptions from "../field-options/field-options.svelte"
  import FieldTypePicker from "../field-picker/field-type-picker.svelte"
  import { LL } from "@undb/i18n/client"
  import { BetweenVerticalStartIcon, LoaderCircleIcon } from "lucide-svelte"
  import { getDataService } from "$lib/store/data-service.store"

  const table = getTable()

  export let onSuccess: () => void = () => {}

  let name = ""

  const dataService = getDataService()

  const client = useQueryClient()
  const createFieldMutation = createMutation(
    derived([table], ([$table]) => ({
      mutationKey: ["table", $table.id.value, "createField"],
      mutationFn: dataService.table.field.createField,
      async onSuccess() {
        toast.success($LL.table.field.created())
        reset()
        await invalidate(`undb:table:${$table.id.value}`)
        await client.invalidateQueries({ queryKey: ["records", $table.id.value] })
        onSuccess()
      },
      onError(error: Error) {
        toast.error(error.message)
      },
    })),
  )

  const defaultValue = createDefaultFieldDTO($table, "string", $LL)
  const form = superForm(defaults(defaultValue, zodClient(createFieldDTO)), {
    SPA: true,
    dataType: "json",
    validators: zodClient(createFieldDTO),
    resetForm: false,
    invalidateAll: false,
    onSubmit(input) {
      validateForm({ update: true })
    },
    onUpdate(event) {
      if (!event.form.valid) {
        console.log(event.form.data, event.form.errors)
        return
      }

      $createFieldMutation.mutate({
        tableId: $table.id.value,
        field: event.form.data,
      })
    },
  })

  const { allErrors, enhance, form: formData, reset, validateForm } = form

  function updateType(type: FieldType) {
    $formData = createDefaultFieldDTO($table, type, $LL)
  }

  function onTypeChange(type: FieldType) {
    updateType(type)
  }

  $: disabled = $createFieldMutation.isPending
</script>

<form method="POST" use:enhance class="space-y-2">
  <Form.Field {form} name="name" class="w-full">
    <Form.Control let:attrs>
      <Input
        {disabled}
        placeholder="Set field display name..."
        on:change={(e) => {
          name = e.target.value
        }}
        {...attrs}
        bind:value={$formData.name}
        autofocus
        class="w-full"
      />
    </Form.Control>
    <Form.Description />
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="type" class="w-full">
    <Form.Control let:attrs>
      <FieldTypePicker
        {...attrs}
        {disabled}
        value={$formData.type}
        onValueChange={onTypeChange}
        tabIndex={-1}
        class="h-9 w-full"
      />
    </Form.Control>
    <Form.Description />
    <Form.FieldErrors />
  </Form.Field>

  <FieldOptions
    {disabled}
    type={$formData.type}
    bind:option={$formData.option}
    bind:constraint={$formData.constraint}
    bind:display={$formData.display}
    bind:defaultValue={$formData.defaultValue}
  />

  <Form.Field {form} name="constraint" class="w-full">
    <Form.Control let:attrs></Form.Control>
    <Form.Description />
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="option" class="w-full">
    <Form.Control let:attrs></Form.Control>
    <Form.Description />
    <Form.FieldErrors />
  </Form.Field>

  <div class="flex w-full border-t pt-3">
    <Button {disabled} type="submit" class="w-full" size="sm" variant="outline">
      {#if $createFieldMutation.isPending}
        <LoaderCircleIcon class="mr-2 h-4 w-4 animate-spin" />
      {:else}
        <BetweenVerticalStartIcon class="mr-2 h-4 w-4" />
      {/if}

      {$LL.table.field.create()}
    </Button>
  </div>
</form>

<!-- <SuperDebug data={$formData} /> -->
