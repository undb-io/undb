import type { Field } from '@egodb/core'
import { useDeleteFieldMutation } from '@egodb/store'
import type { MenuItemProps } from '@egodb/ui'
import { ActionIcon, IconDots, IconPencil, IconTrash, Menu } from '@egodb/ui'
import { useConfirmModal } from '../../hooks'
import { useCurrentTable } from '../../hooks/use-current-table'

export const FieldMenu: React.FC<{ field: Field }> = ({ field }) => {
  const table = useCurrentTable()
  const [deleteField] = useDeleteFieldMutation()

  const confirm = useConfirmModal({
    onConfirm() {
      deleteField({
        tableId: table.id.value,
        id: field.id.value,
      })
    },
  })

  const menuProps: MenuItemProps = {
    p: 'xs',
    h: 35,
    fz: 'xs',
  }

  return (
    <Menu width={180}>
      <Menu.Target>
        <ActionIcon>
          <IconDots size={14} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item icon={<IconPencil size={14} />} {...menuProps}>
          Update Field
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item icon={<IconTrash size={14} />} {...menuProps} color="red" onClick={confirm}>
          Delete Field
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
