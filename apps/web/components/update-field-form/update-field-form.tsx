import { Button, closeAllModals, Divider, Group, Stack, TextInput } from '@egodb/ui'
import { FieldInputLabel } from '../field-inputs/field-input-label'
import { FieldIcon } from '../field-inputs/field-Icon'
import { FieldVariantControl } from '../field/field-variant-control'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import type { IUpdateFieldSchema, ReferenceField, ReferenceFieldTypes } from '@egodb/core'
import { updateFieldSchema } from '@egodb/core'
import { zodResolver } from '@hookform/resolvers/zod'
import type { IUpdateFieldProps } from './update-field.props'
import { useUpdateFieldMutation } from '@egodb/store'
import { useCurrentTable } from '../../hooks/use-current-table'

export const UpdateFieldForm: React.FC<IUpdateFieldProps> = ({ field, onCancel }) => {
  const table = useCurrentTable()

  const defaultValues: IUpdateFieldSchema = {
    type: field.type,
    name: field.name.value,
  }

  if (defaultValues.type === 'reference') {
    defaultValues.foreignTableId = (field as ReferenceField).foreignTableId.into()
  }
  if (defaultValues.type === 'tree' || defaultValues.type === 'parent' || defaultValues.type === 'reference') {
    defaultValues.displayFieldIds = (field as ReferenceFieldTypes).displayFieldIds.map((id) => id.value)
  }

  const form = useForm<IUpdateFieldSchema>({
    defaultValues,
    resolver: zodResolver(updateFieldSchema),
  })

  const [updateField, { isLoading }] = useUpdateFieldMutation()

  const onSubmit = form.handleSubmit(async (data) => {
    const values: IUpdateFieldSchema = { type: data.type }

    for (const [key, value] of Object.entries(data)) {
      const k = key as keyof IUpdateFieldSchema
      if (k === 'type') continue
      const isDirty = form.getFieldState(k).isDirty
      if (isDirty) {
        values[k] = value as IUpdateFieldSchema[typeof k]
      }
    }

    await updateField({
      tableId: table.id.value,
      fieldId: field.id.value,
      field: values,
    })
    form.reset()
    closeAllModals()
  })

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit}>
        <Stack>
          <Controller
            name="type"
            control={form.control}
            render={(props) => (
              <TextInput
                {...props.field}
                disabled
                readOnly
                required
                label={<FieldInputLabel>type</FieldInputLabel>}
                icon={<FieldIcon type={form.watch('type')} />}
              />
            )}
          />
          <TextInput {...form.register('name')} label={<FieldInputLabel>name</FieldInputLabel>} />

          <FieldVariantControl isNew={false} />

          <Divider />

          <Group position="right">
            <Button
              variant="subtle"
              onClick={() => {
                onCancel?.()
                closeAllModals()
              }}
            >
              Cancel
            </Button>

            <Button
              loading={isLoading}
              miw={200}
              disabled={!form.formState.isValid || !form.formState.isDirty}
              type="submit"
            >
              Update
            </Button>
          </Group>
        </Stack>
      </form>
    </FormProvider>
  )
}
