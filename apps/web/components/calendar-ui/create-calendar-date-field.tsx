import type { ICreateDateFieldSchema } from '@egodb/core'
import { createDateFieldSchema } from '@egodb/core'
import {
  Button,
  Card,
  FocusTrap,
  Group,
  IconChevronLeft,
  Stack,
  Text,
  TextInput,
  useForm,
  zodResolver,
} from '@egodb/ui'
import { useSetAtom } from 'jotai'
import { trpc } from '../../trpc'
import type { ITableBaseProps } from '../table/table-base-props'
import { calendarStepZero } from './calendar-step.atom'

interface IProps extends ITableBaseProps {
  onSuccess?: () => void
}

export const CreateCalendarDateField: React.FC<IProps> = ({ table, onSuccess }) => {
  const form = useForm<ICreateDateFieldSchema>({
    initialValues: {
      type: 'date',
      id: 'id',
      name: '',
    },
    validate: zodResolver(createDateFieldSchema),
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

      setCalendarField.mutate({
        tableId: table.id.value,
        field: id,
      })
    },
  })

  const onSubmit = form.onSubmit((values) => {
    createDateField.mutate({
      id: table.id.value,
      field: values,
    })
  })

  const setStepZero = useSetAtom(calendarStepZero)
  const props = form.getInputProps('name')
  return (
    <form onSubmit={onSubmit}>
      <Card shadow="sm">
        <Card.Section withBorder inheritPadding py="sm">
          <Text>create new date field</Text>
        </Card.Section>

        <Card.Section withBorder inheritPadding py="sm">
          <Stack spacing="xs">
            <FocusTrap>
              <TextInput
                {...props}
                onChange={(e) => {
                  props.onChange(e)
                  form.setFieldValue('id', e.target.value)
                }}
                placeholder="new date field name"
              />
            </FocusTrap>
          </Stack>
        </Card.Section>

        <Card.Section withBorder inheritPadding py="sm">
          <Group position="right">
            <Button leftIcon={<IconChevronLeft size={14} />} size="xs" variant="white" onClick={setStepZero}>
              Select Existing Field
            </Button>
            <Button size="xs" type="submit" disabled={!form.isValid()}>
              Done
            </Button>
          </Group>
        </Card.Section>
      </Card>
    </form>
  )
}
