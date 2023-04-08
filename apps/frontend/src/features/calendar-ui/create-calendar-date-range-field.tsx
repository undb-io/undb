import type { ICreateDateRangeFieldSchema } from '@undb/core'
import { FieldId } from '@undb/core'
import { createDateRangeFieldSchema } from '@undb/core'
import { useCreateFieldMutation, useSetCalendarFieldMutation } from '@undb/store'
import { Button, Card, FocusTrap, Group, IconChevronLeft, Stack, Text, TextInput } from '@undb/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSetAtom } from 'jotai'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'
import { calendarStepZero } from './calendar-step.atom'

interface IProps {
  onSuccess?: () => void
}

export const CreateCalendarDateRangeField: React.FC<IProps> = ({ onSuccess }) => {
  const table = useCurrentTable()
  const view = useCurrentView()

  const form = useForm<ICreateDateRangeFieldSchema>({
    defaultValues: {
      type: 'date-range',
      name: '',
    },
    resolver: zodResolver(createDateRangeFieldSchema),
  })

  const [setCalendarField] = useSetCalendarFieldMutation()

  const [createDateRangeField, { isLoading }] = useCreateFieldMutation()

  const onSubmit = form.handleSubmit(async (values) => {
    values.id = FieldId.createId()
    await createDateRangeField({
      tableId: table.id.value,
      field: values,
    })

    await setCalendarField({
      tableId: table.id.value,
      viewId: view.id.value,
      field: values.id,
    })

    onSuccess?.()
  })
  const { t } = useTranslation()
  const setStepZero = useSetAtom(calendarStepZero)
  return (
    <form onSubmit={onSubmit}>
      <Card shadow="sm" withBorder sx={{ overflow: 'visible' }}>
        <Card.Section withBorder inheritPadding py="sm">
          <Text>{t('Create New Date Range Field')}</Text>
        </Card.Section>

        <Card.Section withBorder inheritPadding py="sm">
          <Stack spacing="xs">
            <FocusTrap>
              <TextInput {...form.register('name')} placeholder={t('Field Name') as string} />
            </FocusTrap>
          </Stack>
        </Card.Section>

        <Card.Section withBorder inheritPadding py="sm">
          <Group position="right">
            <Button leftIcon={<IconChevronLeft size={14} />} size="xs" variant="white" onClick={setStepZero}>
              {t('Select Existing Field')}
            </Button>
            <Button size="xs" type="submit" disabled={!form.formState.isValid} loading={isLoading}>
              {t('Done', { ns: 'common' })}
            </Button>
          </Group>
        </Card.Section>
      </Card>
    </form>
  )
}
