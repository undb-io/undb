import { Button, closeAllModals, Divider, Group, Select, Stack, TextInput } from '@egodb/ui'
import { FIELD_SELECT_ITEMS } from '../../constants/field.constants'
import { FieldInputLabel } from '../field-inputs/field-input-label'
import { FieldIcon } from '../field-inputs/field-Icon'
import { FieldVariantControl } from '../field/field-variant-control'
import { FieldItem } from '../field-inputs/field-item'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import type { ICreateFieldSchema } from '@egodb/core'
import { createFieldSchema } from '@egodb/core'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ICreateFieldProps } from './create-field.props'
import { useCreateFieldMutation } from '@egodb/store'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'
import { useTranslation } from 'react-i18next'

export const CreateFieldForm: React.FC<ICreateFieldProps> = ({ onCancel, at }) => {
  const table = useCurrentTable()
  const view = useCurrentView()

  const { t } = useTranslation()

  const defaultValues: ICreateFieldSchema = {
    type: 'string',
    name: '',
  }

  const form = useForm<ICreateFieldSchema>({
    defaultValues,
    resolver: zodResolver(createFieldSchema),
  })

  const [createField, { isLoading }] = useCreateFieldMutation()

  const onSubmit = form.handleSubmit(async (values) => {
    await createField({
      tableId: table.id.value,
      field: values,
      viewId: view.id.value,
      at,
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
              <Select
                {...props.field}
                searchable
                onChange={(type) => type && props.field.onChange(type)}
                required
                label={<FieldInputLabel>{t('Type', { ns: 'common' })}</FieldInputLabel>}
                data={FIELD_SELECT_ITEMS.map((item) => ({ value: item.value, label: t(item.label!) as string }))}
                itemComponent={FieldItem}
                icon={<FieldIcon type={form.watch('type')} />}
                withinPortal
              />
            )}
          />
          <TextInput
            {...form.register('name')}
            label={<FieldInputLabel>{t('Name', { ns: 'common' })}</FieldInputLabel>}
            required
            placeholder={t('Field Name') as string}
          />
          <FieldVariantControl isNew />

          <Divider />

          <Group position="right">
            <Button
              variant="subtle"
              onClick={() => {
                onCancel?.()
                closeAllModals()
              }}
            >
              {t('Cancel', { ns: 'common' })}
            </Button>

            <Button loading={isLoading} miw={200} disabled={!form.formState.isValid} type="submit">
              {t('Create', { ns: 'common' })}
            </Button>
          </Group>
        </Stack>
      </form>
    </FormProvider>
  )
}
