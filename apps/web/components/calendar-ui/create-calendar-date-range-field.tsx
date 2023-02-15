import type { ICreateDateRangeFieldSchema } from '@egodb/core'
import { FieldId } from '@egodb/core'
import { createDateRangeFieldSchema } from '@egodb/core'
import { useCreateFieldMutation, useSetCalendarFieldMutation } from '@egodb/store'
import { Button, Card, FocusTrap, Group, IconChevronLeft, Stack, Text, TextInput } from '@egodb/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSetAtom } from 'jotai'
import { useForm } from 'react-hook-form'
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

  const setStepZero = useSetAtom(calendarStepZero)
  return (
    <form onSubmit={onSubmit}>
      <Card shadow="sm">
        <Card.Section withBorder inheritPadding py="sm">
          <Text>create new date range field</Text>
        </Card.Section>

        <Card.Section withBorder inheritPadding py="sm">
          <Stack spacing="xs">
            <FocusTrap>
              <TextInput {...form.register('name')} placeholder="new date range field name" />
            </FocusTrap>
          </Stack>
        </Card.Section>

        <Card.Section withBorder inheritPadding py="sm">
          <Group position="right">
            <Button leftIcon={<IconChevronLeft size={14} />} size="xs" variant="white" onClick={setStepZero}>
              Select Existing Field
            </Button>
            <Button size="xs" type="submit" disabled={!form.formState.isValid} loading={isLoading}>
              Done
            </Button>
          </Group>
        </Card.Section>
      </Card>
    </form>
  )
}
