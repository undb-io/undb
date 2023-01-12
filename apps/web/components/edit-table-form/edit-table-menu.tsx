import { Group, ActionIcon, IconDots, Text, Menu } from '@egodb/ui'
import { useSetAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { useConfirmModal } from '../../hooks'
import { trpc } from '../../trpc'
import type { ITableBaseProps } from '../table/table-base-props'
import { editTableFormDrawerOpened } from './drawer-opened.atom'

export const EditTableMenu: React.FC<ITableBaseProps> = ({ table }) => {
  const setOpened = useSetAtom(editTableFormDrawerOpened)
  const utils = trpc.useContext()
  const router = useRouter()

  const onSuccess = async () => {
    await utils.table.list.refetch()
    setOpened(false)
    router.replace('/')
  }
  const deleteTable = trpc.table.delete.useMutation({
    onSuccess,
  })

  const confirm = useConfirmModal({
    onConfirm() {
      deleteTable.mutate({
        id: table.id.value,
      })
    },
  })

  return (
    <Group w="100%" position="apart">
      <Text>Edit Table</Text>
      <Menu>
        <Menu.Target>
          <ActionIcon>
            <IconDots size={17} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item color="red" onClick={confirm}>
            Delete Table
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  )
}
