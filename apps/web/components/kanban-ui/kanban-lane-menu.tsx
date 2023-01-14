import type { Field } from '@egodb/core'
import { ActionIcon, IconDots, Menu } from '@egodb/ui'
import { useConfirmModal } from '../../hooks'
import { trpc } from '../../trpc'
import type { ITableBaseProps } from '../table/table-base-props'

interface IProps extends ITableBaseProps {
  field: Field
  optionId: string
  children?: React.ReactNode
}

export const KanbanLaneMenu: React.FC<IProps> = ({ table, field, optionId, children }) => {
  const utils = trpc.useContext()
  const deleteOption = trpc.table.field.select.deleteOption.useMutation({
    onSuccess() {
      utils.table.get.refetch()
      utils.record.list.refetch()
    },
  })

  const confirm = useConfirmModal({
    onConfirm() {
      deleteOption.mutate({
        tableId: table.id.value,
        fieldId: field.id.value,
        id: optionId,
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
        <Menu.Item color="red" onClick={confirm}>
          Delete Option
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
