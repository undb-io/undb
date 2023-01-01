import type { ICreateSelectFieldSchema } from '@egodb/core'
import { createSelectFieldSchema } from '@egodb/core'
import { FieldId } from '@egodb/core'
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
import { SelectFieldControl } from '../fields/select-field-control'
import type { ITableBaseProps } from '../table/table-base-props'
import { stepZeroAtom } from './kanban-step.atom'

interface IProps extends ITableBaseProps {
  onSuccess?: () => void
}

export const CreateSelectField: React.FC<IProps> = ({ table, onSuccess }) => {
  const form = useForm<ICreateSelectFieldSchema>({
    initialValues: {
      type: 'select',
      id: 'id',
      name: '',
      options: [],
    },
    validate: zodResolver(createSelectFieldSchema),
  })

  const utils = trpc.useContext()

  const setKanbanField = trpc.table.setKanbanField.useMutation({
    onSuccess() {
      utils.table.get.refetch()
      setStepZero()
      onSuccess?.()
    },
  })

  const createSelectField = trpc.table.createField.useMutation({
    onSuccess(_, variables) {
      const id = variables.field.id

      setKanbanField.mutate({
        tableId: table.id.value,
        field: id,
      })
    },
  })

  const onSubmit = form.onSubmit((values) => {
    createSelectField.mutate({
      id: table.id.value,
      field: { ...values, id: FieldId.create().value },
    })
  })

  const setStepZero = useSetAtom(stepZeroAtom)

  return (
    <form onSubmit={onSubmit}>
      <Card shadow="sm">
        <Card.Section withBorder inheritPadding py="sm">
          <Text>create new select field</Text>
        </Card.Section>

        <Card.Section withBorder inheritPadding py="sm">
          <Stack spacing="xs">
            <FocusTrap>
              <TextInput {...form.getInputProps('name')} placeholder="new select field name" />
            </FocusTrap>
            <SelectFieldControl onChange={(options) => form.setFieldValue('options', options)} />
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
