import type { ICreateTreeFieldSchema } from '@egodb/core'
import { FieldId } from '@egodb/core'
import { createTreeFieldSchema } from '@egodb/core'
import { Button, Card, FocusTrap, Group, IconChevronLeft, Stack, Text, TextInput } from '@egodb/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSetAtom } from 'jotai'
import { useForm } from 'react-hook-form'
import { trpc } from '../../trpc'
import type { ITableBaseProps } from '../table/table-base-props'
import { treeStepZeroAtom } from './tree-step.atom'

interface IProps extends ITableBaseProps {
  onSuccess?: () => void
}

export const CreateTreeField: React.FC<IProps> = ({ table, onSuccess }) => {
  const form = useForm<ICreateTreeFieldSchema>({
    defaultValues: {
      type: 'tree',
      name: '',
    },
    resolver: zodResolver(createTreeFieldSchema),
  })

  const utils = trpc.useContext()

  const setKanbanField = trpc.table.view.tree.setField.useMutation({
    onSuccess() {
      utils.table.get.refetch()
      setStepZero()
      onSuccess?.()
    },
  })

  const createTreeField = trpc.table.field.create.useMutation({
    onSuccess(_, variables) {
      const id = variables.field.id

      if (id) {
        setKanbanField.mutate({
          tableId: table.id.value,
          field: id,
        })
      }
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    values.id = FieldId.createId()
    createTreeField.mutate({
      id: table.id.value,
      field: values,
    })
  })

  const setStepZero = useSetAtom(treeStepZeroAtom)
  return (
    <form onSubmit={onSubmit}>
      <Card shadow="sm">
        <Card.Section withBorder inheritPadding py="sm">
          <Text>create new tree field</Text>
        </Card.Section>

        <Card.Section withBorder inheritPadding py="sm">
          <Stack spacing="xs">
            <FocusTrap>
              <TextInput {...form.register('name')} placeholder="new tree field name" />
            </FocusTrap>
          </Stack>
        </Card.Section>

        <Card.Section withBorder inheritPadding py="sm">
          <Group position="right">
            <Button leftIcon={<IconChevronLeft size={14} />} size="xs" variant="white" onClick={setStepZero}>
              Select Existing Field
            </Button>
            <Button size="xs" type="submit" disabled={!form.formState.isValid} loading={createTreeField.isLoading}>
              Done
            </Button>
          </Group>
        </Card.Section>
      </Card>
    </form>
  )
}
