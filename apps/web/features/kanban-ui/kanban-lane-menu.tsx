import type { Field } from '@egodb/core'
import { useDeleteOptionMutation } from '@egodb/store'
import { ActionIcon, IconDots, IconTrash, Menu } from '@egodb/ui'
import { useConfirmModal } from '../../hooks'
import { useCurrentTable } from '../../hooks/use-current-table'

interface IProps {
  field: Field
  optionKey: string
  children?: React.ReactNode
}

export const KanbanLaneMenu: React.FC<IProps> = ({ field, optionKey, children }) => {
  const table = useCurrentTable()
  const [deleteOption] = useDeleteOptionMutation()

  const confirm = useConfirmModal({
    onConfirm() {
      deleteOption({
        tableId: table.id.value,
        fieldId: field.id.value,
        id: optionKey,
      })
    },
  })

  return (
    <Menu>
      <Menu.Target>
        <ActionIcon>
          <IconDots size={14} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        {children}

        <Menu.Divider />

        <Menu.Item icon={<IconTrash size={14} />} color="red" onClick={confirm} fz="xs" h={35}>
          Delete Option
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
