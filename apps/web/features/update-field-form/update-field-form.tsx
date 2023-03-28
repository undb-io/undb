import {
  Box,
  Button,
  closeAllModals,
  Divider,
  Group,
  HoverCard,
  IconPlus,
  Popover,
  Stack,
  Switch,
  TextInput,
  useDisclosure,
} from '@egodb/ui'
import { FieldInputLabel } from '../field-inputs/field-input-label'
import { FieldIcon } from '../field-inputs/field-Icon'
import { FieldVariantControl } from '../field/field-variant-control'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import type {
  CountField,
  DateFieldTypes,
  IUpdateFieldSchema,
  LookupField,
  ReferenceField,
  ReferenceFieldTypes,
  SelectField,
  SumField,
} from '@egodb/core'
import { canDisplay } from '@egodb/core'
import { updateFieldSchema } from '@egodb/core'
import { zodResolver } from '@hookform/resolvers/zod'
import type { IUpdateFieldProps } from './update-field.props'
import { useUpdateFieldMutation } from '@egodb/store'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useTranslation } from 'react-i18next'
import { DisplayFields } from '../field/display-fields'
import { DevTool } from '@hookform/devtools'

export const UpdateFieldForm: React.FC<IUpdateFieldProps> = ({ field, onCancel }) => {
  const table = useCurrentTable()

  const [display, handler] = useDisclosure()

  const description = field.description?.value
  const defaultValues: IUpdateFieldSchema = {
    type: field.type,
    name: field.name.value,
    description,
    required: field.required,
    display: !!field.display,
  }

  if (defaultValues.type === 'reference') {
    defaultValues.foreignTableId = (field as ReferenceField).foreignTableId.into()
  }
  if (
    defaultValues.type === 'tree' ||
    defaultValues.type === 'parent' ||
    defaultValues.type === 'reference' ||
    defaultValues.type === 'lookup'
  ) {
    defaultValues.displayFieldIds = (field as ReferenceFieldTypes).displayFieldIds.map((id) => id.value)
  }
  if (defaultValues.type === 'count' || defaultValues.type === 'sum' || defaultValues.type === 'average') {
    defaultValues.referenceFieldId = (field as CountField | SumField).referenceFieldId.value
  }
  if (defaultValues.type === 'sum' || defaultValues.type === 'average') {
    defaultValues.aggregateFieldId = (field as SumField).aggregateFieldId.value
  }
  if (defaultValues.type === 'lookup') {
    defaultValues.referenceFieldId = (field as LookupField).referenceFieldId.value
  }
  if (defaultValues.type === 'select') {
    defaultValues.options = (field as SelectField).options.options.map((o) => o.toJSON())
  }

  if (
    defaultValues.type === 'date' ||
    defaultValues.type === 'date-range' ||
    defaultValues.type === 'created-at' ||
    defaultValues.type === 'updated-at'
  ) {
    defaultValues.format = (field as DateFieldTypes).formatString
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
        values[k] = value
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

  const displayField = form.watch('display')

  const { t } = useTranslation()

  const displayFields = table.schema.displayFields.filter(
    (f) => f.id.value !== field.id.value || (f.id.value === field.id.value && displayField),
  )

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
                label={<FieldInputLabel>{t('Type', { ns: 'common' })}</FieldInputLabel>}
                icon={<FieldIcon type={form.watch('type')} />}
              />
            )}
          />
          <TextInput
            {...form.register('name')}
            label={<FieldInputLabel>{t('Name', { ns: 'common' })}</FieldInputLabel>}
          />

          {(!!description || display) && (
            <TextInput
              {...form.register('description')}
              autoFocus
              label={<FieldInputLabel>{t('Description', { ns: 'common' })}</FieldInputLabel>}
            />
          )}

          <FieldVariantControl isNew={false} />

          <Divider />

          <Group position="apart">
            <Button
              leftIcon={<IconPlus size={14} />}
              compact
              size="xs"
              variant="white"
              onClick={handler.open}
              sx={{ visibility: description || display ? 'hidden' : 'visible' }}
            >
              {t('Add Description')}
            </Button>

            <Group position="right">
              {!field.controlled && (
                <Switch
                  {...form.register('required')}
                  checked={form.watch('required')}
                  size="xs"
                  label={t('Required', { ns: 'common' })}
                />
              )}
              {canDisplay(field.type) && (
                <HoverCard closeDelay={300} withinPortal>
                  <HoverCard.Target>
                    <Box>
                      <Switch
                        {...form.register('display')}
                        checked={displayField}
                        size="xs"
                        label={t('Display', { ns: 'common' })}
                      />
                    </Box>
                  </HoverCard.Target>
                  <HoverCard.Dropdown display={displayFields.length ? 'visible' : 'none'}>
                    {!!displayFields.length && (
                      <DisplayFields displayFields={displayFields.map((f) => ({ name: f.name.value }))} />
                    )}
                  </HoverCard.Dropdown>
                </HoverCard>
              )}
              <Button
                compact
                size="xs"
                variant="subtle"
                onClick={() => {
                  onCancel?.()
                  closeAllModals()
                }}
              >
                {t('Cancel', { ns: 'common' })}
              </Button>

              <Button
                compact
                size="xs"
                loading={isLoading}
                disabled={!form.formState.isValid || !form.formState.isDirty}
                type="submit"
              >
                {t('Update', { ns: 'common' })}
              </Button>
            </Group>
          </Group>
        </Stack>

        <DevTool control={form.control} />
      </form>
    </FormProvider>
  )
}
