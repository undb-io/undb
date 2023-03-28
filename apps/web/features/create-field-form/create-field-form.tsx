import {
  Box,
  Button,
  closeAllModals,
  Divider,
  Group,
  HoverCard,
  IconPlus,
  Select,
  Stack,
  Switch,
  TextInput,
  useDisclosure,
} from '@egodb/ui'
import { FIELD_SELECT_ITEMS } from '../../constants/field.constants'
import { FieldInputLabel } from '../field-inputs/field-input-label'
import { FieldIcon } from '../field-inputs/field-Icon'
import { FieldVariantControl } from '../field/field-variant-control'
import { FieldItem } from '../field-inputs/field-item'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import type { ICreateFieldSchema } from '@egodb/core'
import { canDisplay } from '@egodb/core'
import { isControlledFieldType } from '@egodb/core'
import { createFieldSchema } from '@egodb/core'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ICreateFieldProps } from './create-field.props'
import { useCreateFieldMutation } from '@egodb/store'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'
import { useTranslation } from 'react-i18next'
import { useAtomValue } from 'jotai'
import { createFieldInitialValueAtom } from './create-field-initial-value.atom'
import type { ICreateFieldCommandInput } from '@egodb/cqrs'
import { DisplayFields } from '../field/display-fields'

export const CreateFieldForm: React.FC<ICreateFieldProps> = ({ onCancel, at }) => {
  const table = useCurrentTable()
  const view = useCurrentView()

  const [display, handler] = useDisclosure()

  const { t } = useTranslation()

  const initialValue = useAtomValue(createFieldInitialValueAtom)
  const defaultValues: ICreateFieldSchema = initialValue as ICreateFieldCommandInput['field']

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

  const type = form.watch('type')
  const displayField = form.watch('display')

  const displayFields = table.schema.displayFields.map((f) => ({ name: f.name.value }))

  if (displayField) {
    displayFields.push({ name: form.watch('name') })
  }

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
                data={FIELD_SELECT_ITEMS.map((item) => ({
                  value: item.value,
                  label: t(item.label!) as string,
                  group: t(item.group!, { ns: 'common' }) as string,
                }))}
                itemComponent={FieldItem}
                icon={<FieldIcon type={type} />}
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

          {display && (
            <TextInput
              {...form.register('description')}
              autoFocus
              label={<FieldInputLabel>{t('Description', { ns: 'common' })}</FieldInputLabel>}
              placeholder={t('Description', { ns: 'common' }) as string}
            />
          )}

          <Divider />

          <Group position="apart">
            <Button compact size="xs" leftIcon={<IconPlus size={14} />} variant="white" onClick={handler.open}>
              {t('Add Description')}
            </Button>
            <Group position="right">
              {!isControlledFieldType(type) && (
                <Switch {...form.register('required')} size="xs" label={t('Required', { ns: 'common' })} />
              )}
              {canDisplay(type) && (
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
                  <HoverCard.Dropdown>
                    {!!displayFields.length && (
                      <DisplayFields displayFields={displayFields.map((f) => ({ name: f.name }))} />
                    )}
                  </HoverCard.Dropdown>
                </HoverCard>
              )}
              <Button
                variant="subtle"
                compact
                size="xs"
                onClick={() => {
                  onCancel?.()
                  closeAllModals()
                }}
              >
                {t('Cancel', { ns: 'common' })}
              </Button>

              <Button compact size="xs" loading={isLoading} disabled={!form.formState.isValid} type="submit">
                {t('Create', { ns: 'common' })}
              </Button>
            </Group>
          </Group>
        </Stack>
      </form>
    </FormProvider>
  )
}
