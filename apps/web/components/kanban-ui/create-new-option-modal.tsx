import type { ICreateOptionSchema } from '@egodb/core'
import { OptionId } from '@egodb/core'
import { createOptionSchema } from '@egodb/core'
import { Button, Divider, Group, Modal, Stack, TextInput, useForm, zodResolver } from '@egodb/ui'
import { useAtom } from 'jotai'
import { trpc } from '../../trpc'
import type { ITableBaseProps } from '../table/table-base-props'
import { createNewOptionOpened } from './create-new-option.atom'

export const CreateNewOptionModal: React.FC<ITableBaseProps> = ({ table }) => {
  const [opened, setOpened] = useAtom(createNewOptionOpened)
  const form = useForm<ICreateOptionSchema>({
    initialValues: {
      name: '',
    },
    validate: zodResolver(createOptionSchema),
  })

  const utils = trpc.useContext()

  const createOption = trpc.table.createOption.useMutation({
    onSuccess() {
      setOpened(false)
      form.reset()
      utils.table.get.refetch()
    },
  })

  const onSubmit = form.onSubmit((values) => {
    values.id = OptionId.create().value
    createOption.mutate({
      tableId: table.id.value,
      option: values,
    })
  })

  return (
    <Modal title="Create New Option" opened={opened} onClose={() => setOpened(false)}>
      <form onSubmit={onSubmit}>
        <Stack>
          <TextInput placeholder="option name" {...form.getInputProps('name')} />
          <Divider />
          <Group position="right">
            <Button variant="white" onClick={() => setOpened(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!form.isValid()}>
              Done
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
