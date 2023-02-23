import type { ICreateSelectFieldSchema } from '@egodb/core'
import { FieldId } from '@egodb/core'
import { createSelectFieldSchema } from '@egodb/core'
import { useCreateFieldMutation, useSetKanbanFieldMutation } from '@egodb/store'
import { Button, Card, FocusTrap, Group, IconChevronLeft, Stack, Text, TextInput } from '@egodb/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSetAtom } from 'jotai'
import { Controller, useForm } from 'react-hook-form'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'
import { SelectFieldControl } from '../field-inputs/select-field-control'
import { kanbanStepZeroAtom } from './kanban-step.atom'

interface IProps {
  onSuccess?: () => void
}

export const CreateSelectField: React.FC<IProps> = ({ onSuccess }) => {
  const table = useCurrentTable()
  const view = useCurrentView()

  const form = useForm<ICreateSelectFieldSchema>({
    defaultValues: {
      type: 'select',
      name: '',
      options: [],
    },
    resolver: zodResolver(createSelectFieldSchema),
  })

  const [createSelectField, { isLoading }] = useCreateFieldMutation()
  const [setKanbanField] = useSetKanbanFieldMutation()

  const onSubmit = form.handleSubmit(async (values) => {
    values.id = FieldId.createId()
    await createSelectField({
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
      <Card shadow="sm" withBorder sx={{ overflow: 'visible' }}>
        <Card.Section withBorder inheritPadding py="sm">
          <Text>create new select field</Text>
        </Card.Section>

        <Card.Section withBorder inheritPadding py="sm">
          <Stack spacing="xs">
            <FocusTrap>
              <TextInput {...form.register('name')} placeholder="new select field name" />
            </FocusTrap>
            <Controller
              control={form.control}
              name="options"
              render={(props) => <SelectFieldControl {...props.field} />}
            />
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
