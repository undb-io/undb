import type { Field } from '@egodb/core'
import { useDeleteFieldMutation } from '@egodb/store'
import { ActionIcon, IconDots, Menu } from '@egodb/ui'
import { useConfirmModal } from '../../hooks'

export const HeaderMenu: React.FC<{ tableId: string; field: Field }> = ({ tableId, field }) => {
  const [deleteField] = useDeleteFieldMutation()

  const confirm = useConfirmModal({
    onConfirm() {
      deleteField({
        tableId,
        id: field.id.value,
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
        <Menu.Item color="red" onClick={confirm}>
          Delete Field
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
