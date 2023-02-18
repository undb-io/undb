import type { Field } from '@egodb/core'
import { useDeleteFieldMutation } from '@egodb/store'
import type { MenuItemProps } from '@egodb/ui'
import { Portal } from '@egodb/ui'
import { openContextModal } from '@egodb/ui'
import { IconPencil, IconTrash, Menu } from '@egodb/ui'
import { useConfirmModal } from '../../hooks'
import { useCurrentTable } from '../../hooks/use-current-table'
import { UPDATE_FIELD_MODAL_ID } from '../../modals'

export const FieldMenuDropdown: React.FC<{ field: Field }> = ({ field }) => {
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
    <Portal>
      <Menu.Dropdown>
        <Menu.Item
          icon={<IconPencil size={14} />}
          {...menuProps}
          onClick={() =>
            openContextModal({
              title: 'Update Field',
              modal: UPDATE_FIELD_MODAL_ID,
              innerProps: { field },
            })
          }
        >
          Update Field
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item icon={<IconTrash size={14} />} {...menuProps} color="red" onClick={confirm}>
          Delete Field
        </Menu.Item>
      </Menu.Dropdown>
    </Portal>
  )
}
