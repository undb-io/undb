import type { Field } from '@egodb/core'
import { ActionIcon, IconDots, Menu } from '@egodb/ui'
import { useConfirmModal } from '../../hooks'
import { trpc } from '../../trpc'

export const HeaderMenu: React.FC<{ tableId: string; field: Field }> = ({ tableId, field }) => {
  const utils = trpc.useContext()
  const deleteField = trpc.table.field.delete.useMutation({
    onSuccess() {
      utils.table.get.refetch()
    },
  })

  const confirm = useConfirmModal({
    onConfirm() {
      deleteField.mutate({
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
