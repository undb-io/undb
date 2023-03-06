import type { IUpdateOptionSchema } from '@egodb/core'
import type { IMutateOptionSchema } from '@egodb/core'
import type { SelectField } from '@egodb/core'
import { updateOptionSchema } from '@egodb/core'
import { OptionColor } from '@egodb/core'
import { useUpdateOptionMutation } from '@egodb/store'
import { Group, Button, TextInput, Stack, closeAllModals } from '@egodb/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { OptionColorPicker } from '../field-inputs/option-color-picker'

interface IProps {
  tableId: string
  field: SelectField
  optionKey: string
  option: IMutateOptionSchema
}

export const UpdateOptionForm: React.FC<IProps> = ({ tableId, field, optionKey, option }) => {
  const form = useForm<IUpdateOptionSchema>({
    defaultValues: {
      name: option.name,
      color: option.color ?? OptionColor.defaultColor,
    },
    resolver: zodResolver(updateOptionSchema),
  })

  const [updateOption, { isLoading }] = useUpdateOptionMutation()

  const onSubmit = form.handleSubmit(async (values) => {
    await updateOption({
      tableId,
      fieldId: field.id.value,
      id: optionKey,
      option: values,
    })
    form.reset()
    closeAllModals()
  })

  const { t } = useTranslation()

  return (
    <form onSubmit={onSubmit}>
      <Stack>
        <Group>
          <Controller
            name="color"
            control={form.control}
            render={(props) => (
              <OptionColorPicker {...props.field} option={{ name: form.watch('name'), color: props.field.value }} />
            )}
          />
          <TextInput data-autofocus placeholder="option name..." variant="unstyled" {...form.register('name')} />
        </Group>

        <Group position="right">
          <Button size="xs" variant="white" onClick={() => closeAllModals()}>
            {t('Cancel', { ns: 'common' })}
          </Button>
          <Button
            size="xs"
            type="submit"
            disabled={!form.formState.isValid || !form.formState.isDirty}
            loading={isLoading}
          >
            {t('Done', { ns: 'common' })}
          </Button>
        </Group>
      </Stack>
    </form>
  )
}
