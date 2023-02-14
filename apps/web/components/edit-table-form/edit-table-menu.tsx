import { useDeleteTableMutation } from '@egodb/store'
import { Group, ActionIcon, IconDots, Text, Menu } from '@egodb/ui'
import { useSetAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { useConfirmModal } from '../../hooks'
import { useCurrentTable } from '../../hooks/use-current-table'
import { editTableFormDrawerOpened } from './drawer-opened.atom'

export const EditTableMenu: React.FC = () => {
  const table = useCurrentTable()

  const setOpened = useSetAtom(editTableFormDrawerOpened)
  const router = useRouter()

  const [deleteTable] = useDeleteTableMutation()

  const confirm = useConfirmModal({
    async onConfirm() {
      await deleteTable({
        id: table.id.value,
      })
      setOpened(false)
      router.replace('/')
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
