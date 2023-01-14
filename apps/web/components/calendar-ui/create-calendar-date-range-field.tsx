import type { ICreateDateRangeFieldSchema } from '@egodb/core'
import { createDateRangeFieldSchema } from '@egodb/core'
import { Button, Card, FocusTrap, Group, IconChevronLeft, Stack, Text, TextInput } from '@egodb/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSetAtom } from 'jotai'
import { useForm } from 'react-hook-form'
import { trpc } from '../../trpc'
import type { ITableBaseProps } from '../table/table-base-props'
import { calendarStepZero } from './calendar-step.atom'

interface IProps extends ITableBaseProps {
  onSuccess?: () => void
}

export const CreateCalendarDateRangeField: React.FC<IProps> = ({ table, onSuccess }) => {
  const form = useForm<ICreateDateRangeFieldSchema>({
    defaultValues: {
      type: 'date-range',
      key: 'key',
      name: '',
    },
    resolver: zodResolver(createDateRangeFieldSchema),
  })

  const utils = trpc.useContext()

  const setCalendarField = trpc.table.view.calendar.setField.useMutation({
    onSuccess() {
      utils.table.get.refetch()
      setStepZero()
      onSuccess?.()
    },
  })

  const createDateRangeField = trpc.table.field.create.useMutation({
    onSuccess(_, variables) {
      const id = variables.field.key

      setCalendarField.mutate({
        tableId: table.id.value,
        field: id,
      })
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    createDateRangeField.mutate({
      id: table.id.value,
      field: values,
    })
  })

  const setStepZero = useSetAtom(calendarStepZero)
  const props = form.register('name')
  return (
    <form onSubmit={onSubmit}>
      <Card shadow="sm">
        <Card.Section withBorder inheritPadding py="sm">
          <Text>create new date range field</Text>
        </Card.Section>

        <Card.Section withBorder inheritPadding py="sm">
          <Stack spacing="xs">
            <FocusTrap>
              <TextInput
                {...props}
                onChange={(e) => {
                  props.onChange(e)
                  form.setValue('key', e.target.value)
                }}
                placeholder="new date range field name"
              />
            </FocusTrap>
          </Stack>
        </Card.Section>

        <Card.Section withBorder inheritPadding py="sm">
          <Group position="right">
            <Button leftIcon={<IconChevronLeft size={14} />} size="xs" variant="white" onClick={setStepZero}>
              Select Existing Field
            </Button>
            <Button size="xs" type="submit" disabled={!form.formState.isValid} loading={createDateRangeField.isLoading}>
              Done
            </Button>
          </Group>
        </Card.Section>
      </Card>
    </form>
  )
}
