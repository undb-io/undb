import { ActionIcon, Alert, Group, IconCopy, IconDots, IconTrash, Menu, useClipboard } from '@egodb/ui'
import { useConfirmModal } from '../../hooks'
import { trpc } from '../../trpc'
import type { TRow } from './interface'

export const RecordActions: React.FC<{ row: TRow; tableId: string }> = ({ tableId, row }) => {
  const { copy } = useClipboard({ timeout: 500 })
  const utils = trpc.useContext()
  const deleteRecord = trpc.record.delete.useMutation({
    onSuccess() {
      utils.record.list.refetch()
    },
  })

  const confirm = useConfirmModal({
    children: <Alert color="red">Confirm to Delete Record {row.id} ?</Alert>,
    confirmProps: { loading: deleteRecord.isLoading },
    onConfirm: () => {
      deleteRecord.mutate({
        tableId,
        id: row.id,
      })
    },
  })

  return (
    <Group>
      <Menu>
        <Menu.Target>
          <ActionIcon onClick={(e) => e.stopPropagation()} size="sm">
            <IconDots />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            onClick={(e) => {
              e.stopPropagation()
              copy(row.id)
            }}
            icon={<IconCopy size={14} />}
          >
            Copy Record Id
          </Menu.Item>
          <Menu.Item
            color="red"
            onClick={(e) => {
              e.stopPropagation()
              confirm()
            }}
            icon={<IconTrash size={14} />}
          >
            Delete Record
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  )
}
