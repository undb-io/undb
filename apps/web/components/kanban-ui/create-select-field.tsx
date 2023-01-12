import type { ICreateSelectFieldSchema } from '@egodb/core'
import { createSelectFieldSchema } from '@egodb/core'
import { Button, Card, FocusTrap, Group, IconChevronLeft, Stack, Text, TextInput } from '@egodb/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSetAtom } from 'jotai'
import { useForm } from 'react-hook-form'
import { trpc } from '../../trpc'
import { SelectFieldControl } from '../fields/select-field-control'
import type { ITableBaseProps } from '../table/table-base-props'
import { kanbanStepZeroAtom } from './kanban-step.atom'

interface IProps extends ITableBaseProps {
  onSuccess?: () => void
}

export const CreateSelectField: React.FC<IProps> = ({ table, onSuccess }) => {
  const form = useForm<ICreateSelectFieldSchema>({
    defaultValues: {
      type: 'select',
      id: '',
      name: '',
      options: [],
    },
    resolver: zodResolver(createSelectFieldSchema),
  })

  const utils = trpc.useContext()

  const setKanbanField = trpc.table.view.kanban.setField.useMutation({
    onSuccess() {
      utils.table.get.refetch()
      setStepZero()
      onSuccess?.()
    },
  })

  const createSelectField = trpc.table.field.create.useMutation({
    onSuccess(_, variables) {
      const id = variables.field.id

      setKanbanField.mutate({
        tableId: table.id.value,
        field: id,
      })
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    createSelectField.mutate({
      id: table.id.value,
      field: values,
    })
  })

  const setStepZero = useSetAtom(kanbanStepZeroAtom)
  const props = form.register('name')
  return (
    <form onSubmit={onSubmit}>
      <Card shadow="sm">
        <Card.Section withBorder inheritPadding py="sm">
          <Text>create new select field</Text>
        </Card.Section>

        <Card.Section withBorder inheritPadding py="sm">
          <Stack spacing="xs">
            <FocusTrap>
              <TextInput
                {...props}
                onChange={(e) => {
                  props.onChange(e)
                  form.setValue('id', e.target.value)
                }}
                placeholder="new select field name"
              />
            </FocusTrap>
            <SelectFieldControl onChange={(options) => form.setValue('options', options)} />
          </Stack>
        </Card.Section>

        <Card.Section withBorder inheritPadding py="sm">
          <Group position="right">
            <Button leftIcon={<IconChevronLeft size={14} />} size="xs" variant="white" onClick={setStepZero}>
              Select Existing Field
            </Button>
            <Button size="xs" type="submit" disabled={!form.formState.isValid} loading={createSelectField.isLoading}>
              Done
            </Button>
          </Group>
        </Card.Section>
      </Card>
    </form>
  )
}
