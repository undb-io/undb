import type { ICreateDateFieldSchema } from '@egodb/core'
import { FieldId } from '@egodb/core'
import { createDateFieldSchema } from '@egodb/core'
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

export const CreateCalendarDateField: React.FC<IProps> = ({ table, onSuccess }) => {
  const form = useForm<ICreateDateFieldSchema>({
    defaultValues: {
      type: 'date',
      name: '',
    },
    resolver: zodResolver(createDateFieldSchema),
  })

  const utils = trpc.useContext()

  const setCalendarField = trpc.table.view.calendar.setField.useMutation({
    onSuccess() {
      utils.table.get.refetch()
      setStepZero()
      onSuccess?.()
    },
  })

  const createDateField = trpc.table.field.create.useMutation({
    onSuccess(_, variables) {
      const id = variables.field.id

      if (id) {
        setCalendarField.mutate({
          tableId: table.id.value,
          field: id,
        })
      }
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    values.id = FieldId.createId()
    createDateField.mutate({
      tableId: table.id.value,
      field: values,
    })
  })

  const setStepZero = useSetAtom(calendarStepZero)
  return (
    <form onSubmit={onSubmit}>
      <Card shadow="sm">
        <Card.Section withBorder inheritPadding py="sm">
          <Text>create new date field</Text>
        </Card.Section>

        <Card.Section withBorder inheritPadding py="sm">
          <Stack spacing="xs">
            <FocusTrap>
              <TextInput {...form.register('name')} placeholder="new date field name" />
            </FocusTrap>
          </Stack>
        </Card.Section>

        <Card.Section withBorder inheritPadding py="sm">
          <Group position="right">
            <Button leftIcon={<IconChevronLeft size={14} />} size="xs" variant="white" onClick={setStepZero}>
              Select Existing Field
            </Button>
            <Button size="xs" type="submit" disabled={!form.formState.isValid} loading={createDateField.isLoading}>
              Done
            </Button>
          </Group>
        </Card.Section>
      </Card>
    </form>
  )
}
