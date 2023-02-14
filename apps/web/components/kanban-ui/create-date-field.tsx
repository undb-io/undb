import type { ICreateDateFieldSchema } from '@egodb/core'
import { FieldId } from '@egodb/core'
import { createDateFieldSchema } from '@egodb/core'
import { useCreateFieldMutation, useSetKanbanFieldMutation } from '@egodb/store'
import { Button, Card, FocusTrap, Group, IconChevronLeft, Stack, Text, TextInput } from '@egodb/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSetAtom } from 'jotai'
import { useForm } from 'react-hook-form'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'
import { kanbanStepZeroAtom } from './kanban-step.atom'

interface IProps {
  onSuccess?: () => void
}

export const CreateDateField: React.FC<IProps> = ({ onSuccess }) => {
  const table = useCurrentTable()
  const view = useCurrentView()
  const form = useForm<ICreateDateFieldSchema>({
    defaultValues: {
      type: 'date',
      name: '',
    },
    resolver: zodResolver(createDateFieldSchema),
  })

  const [createDateField, { isLoading }] = useCreateFieldMutation()
  const [setKanbanField] = useSetKanbanFieldMutation()

  const onSubmit = form.handleSubmit(async (values) => {
    values.id = FieldId.createId()
    await createDateField({
      tableId: table.id.value,
      field: values,
    })

    await setKanbanField({
      tableId: table.id.value,
      viewId: view.id.value,
      field: values.id,
    })
    setStepZero()
    onSuccess?.()
  })

  const setStepZero = useSetAtom(kanbanStepZeroAtom)
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
            <Button size="xs" type="submit" disabled={!form.formState.isValid} loading={isLoading}>
              Done
            </Button>
          </Group>
        </Card.Section>
      </Card>
    </form>
  )
}
