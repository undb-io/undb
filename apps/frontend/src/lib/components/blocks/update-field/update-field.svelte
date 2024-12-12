<script lang="ts">
  import { invalidate } from "$app/navigation"
  import { Button } from "$lib/components/ui/button"
  import * as Form from "$lib/components/ui/form"
  import { Input } from "$lib/components/ui/input"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import {
    createUpdateFieldDTO,
    getIsFieldChangeTypeDisabled,
    getIsSystemFieldType,
    updateFieldDTO,
    type Field,
    type FieldValue,
    type IUpdateFieldDTO,
  } from "@undb/table"
  import { toast } from "svelte-sonner"
  import { derived } from "svelte/store"
  import { Option } from "@undb/domain"
  import SuperDebug, { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import FieldOptions from "../field-options/field-options.svelte"
  import FieldTypePicker from "../field-picker/field-type-picker.svelte"
  import autoAnimate from "@formkit/auto-animate"
  import { FieldFactory } from "@undb/table/src/modules/schema/fields/field.factory"
  import { cn } from "$lib/utils"
  import { LoaderCircleIcon, PencilIcon } from "lucide-svelte"
  import { LL } from "@undb/i18n/client"
  import { getIsFieldCanCastTo } from "@undb/table"
  import { getDataService } from "$lib/store/data-service.store"
  import { type IUpdateFieldCommand } from "@undb/commands"

  const table = getTable()

  export let field: Field

  export let onSuccess: () => void = () => {}

  let type = field.type
  let updatedType = field.type

  $: isTypeChanged = type !== updatedType

  const dataService = getDataService()

  const client = useQueryClient()
  const updateFieldMutation = createMutation(
    derived([table], ([$table]) => ({
      mutationKey: ["table", $table.id.value, "updateField"],
      mutationFn: dataService.table.field.updateField,
      async onSuccess() {
        onSuccess()
        toast.success($LL.table.field.updated())
        await invalidate(`undb:table:${$table.id.value}`)
        await client.invalidateQueries({ queryKey: ["records", $table.id.value] })
        reset()
      },
      onError(error: Error) {
        toast.error(error.message)
      },
    })),
  )

  function getDefaultValue(field: Field): IUpdateFieldDTO {
    return {
      id: field.id.value,
      type: field.type,
      name: field.name.value,
      display: !!field.display,
      defaultValue: (field.defaultValue as Option<FieldValue>)?.into(undefined)?.value as any,
      constraint: field.constraint?.unwrapUnchecked()?.value ?? {},
      option: field.option?.unwrapUnchecked() ?? {},
    }
  }

  const form = superForm<IUpdateFieldDTO>(
    defaults<IUpdateFieldDTO>(getDefaultValue(field), zodClient(updateFieldDTO)),
    {
      SPA: true,
      dataType: "json",
      validators: zodClient(updateFieldDTO),
      resetForm: false,
      invalidateAll: false,
      onSubmit(input) {
        validateForm({ update: true })
      },
      async onUpdate(event) {
        if (!event.form.valid) {
          console.log(event.form.errors, event.form.data)
          return
        }
        const data = event.form.data
        const field = FieldFactory.fromJSON(data).toJSON()

        await $updateFieldMutation.mutateAsync({
          tableId: $table.id.value,
          field,
        })
      },
    },
  )

  const { enhance, form: formData, reset, validateForm } = form
</script>

<form method="POST" use:enhance class={cn("space-y-2", $$restProps.class)}>
  <div class="flex h-8 items-center gap-2">
    <Form.Field {form} name="type" class="h-full">
      <Form.Control let:attrs>
        <FieldTypePicker
          sameWidth={false}
          {...attrs}
          value={$formData.type}
          tabIndex={-1}
          class="h-full"
          filter={(field) => getIsFieldCanCastTo($formData.type, field)}
          disabled={getIsFieldChangeTypeDisabled($formData.type)}
          onValueChange={(value) => {
            form.reset()
            $formData.type = value
            updatedType = value
            $formData = createUpdateFieldDTO($table, field, value)
          }}
        />
      </Form.Control>
      <Form.Description />
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="name" class="h-full flex-1">
      <Form.Control let:attrs>
        <Input {...attrs} bind:value={$formData.name} autofocus class="h-full" />
      </Form.Control>
      <Form.Description />
      <Form.FieldErrors />
    </Form.Field>
  </div>

  {#if isTypeChanged}
    <div class="text-xs text-yellow-600">{$LL.table.field.typeChanged()}</div>
  {/if}

  <div use:autoAnimate>
    {#if !getIsSystemFieldType($formData.type)}
      <Form.Field {form} name="constraint">
        <Form.Control let:attrs>
          <FieldOptions
            isNew={false}
            type={$formData.type}
            {field}
            bind:option={$formData.option}
            bind:constraint={$formData.constraint}
            bind:display={$formData.display}
            bind:defaultValue={$formData.defaultValue}
            {...attrs}
          />
        </Form.Control>
        <Form.Description />
        <Form.FieldErrors />
      </Form.Field>
    {/if}
  </div>
  <div class="flex w-full justify-end border-t pt-4">
    <Button disabled={$updateFieldMutation.isPending} type="submit" variant="outline" class="w-full" size="sm">
      {#if $updateFieldMutation.isPending}
        <LoaderCircleIcon class="mr-2 h-5 w-5 animate-spin" />
      {:else}
        <PencilIcon class="mr-2 h-4 w-4" />
      {/if}
      {$LL.table.field.update()}
    </Button>
  </div>
</form>

<!-- <SuperDebug data={$formData} /> -->
