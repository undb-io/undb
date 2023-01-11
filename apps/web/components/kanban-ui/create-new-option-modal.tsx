import type { ICreateOptionSchema, SelectField } from '@egodb/core'
import { OptionId } from '@egodb/core'
import { createOptionSchema } from '@egodb/core'
import { Button, Divider, Group, Modal, Stack, TextInput } from '@egodb/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAtom } from 'jotai'
import { useForm } from 'react-hook-form'
import { trpc } from '../../trpc'
import type { ITableBaseProps } from '../table/table-base-props'
import { createNewOptionOpened } from './create-new-option.atom'

interface IProps extends ITableBaseProps {
  field: SelectField
}

export const CreateNewOptionModal: React.FC<IProps> = ({ table, field }) => {
  const [opened, setOpened] = useAtom(createNewOptionOpened)
  const form = useForm<ICreateOptionSchema>({
    defaultValues: {
      name: '',
    },
    resolver: zodResolver(createOptionSchema),
  })

  const utils = trpc.useContext()

  const createOption = trpc.table.field.select.createOption.useMutation({
    onSuccess() {
      setOpened(false)
      form.reset()
      utils.table.get.refetch()
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    values.id = OptionId.create().value
    createOption.mutate({
      tableId: table.id.value,
      fieldId: field.id.value,
      option: values,
    })
  })

  return (
    <Modal title="Create New Option" opened={opened} onClose={() => setOpened(false)}>
      <form onSubmit={onSubmit}>
        <Stack>
          <TextInput placeholder="option name" {...form.register('name')} />
          <Divider />
          <Group position="right">
            <Button variant="white" onClick={() => setOpened(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!form.formState.isValid}>
              Done
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
