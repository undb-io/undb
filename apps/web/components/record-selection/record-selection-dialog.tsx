import {
  getHasSelectedRecordIds,
  getSelectedRecordIdList,
  getSelectedRecordIdsCount,
  resetSelectedRecordIds,
  useBulkdDeleteRecordsMutation,
} from '@egodb/store'
import { Dialog, Group, Button, Text } from '@egodb/ui'
import { useAppDispatch, useAppSelector, useConfirmModal } from '../../hooks'
import type { ITableBaseProps } from '../table/table-base-props'

export const RecordSelectionDialog: React.FC<ITableBaseProps> = ({ table }) => {
  const ids = useAppSelector(getSelectedRecordIdList)
  const hasSelectedRecords = useAppSelector(getHasSelectedRecordIds)
  const count = useAppSelector(getSelectedRecordIdsCount)
  const dispatch = useAppDispatch()

  const [bulkDeleteRecords] = useBulkdDeleteRecordsMutation()

  const confirm = useConfirmModal({
    async onConfirm() {
      await bulkDeleteRecords({
        tableId: table.id.value,
        ids: ids as [string, ...string[]],
      })
    },
  })

  return (
    <Dialog
      position={{ left: '50%', bottom: 50 }}
      sx={{ transform: 'translate(-50%, 0) !important' }}
      opened={hasSelectedRecords}
      onClose={() => dispatch(resetSelectedRecordIds())}
      size="lg"
      radius="md"
    >
      <Group position="apart">
        <Group spacing="xs">
          <Text size="sm" fw={500} color="gray.7">
            selected{' '}
            <Text span c="blue" fw={600}>
              {count}
            </Text>{' '}
            records
          </Text>
          <Button compact size="xs" color="dark" variant="outline" onClick={() => dispatch(resetSelectedRecordIds())}>
            Reset
          </Button>
        </Group>
        <Button compact size="xs" color="red" variant="subtle" onClick={confirm}>
          Delete Selected
        </Button>
      </Group>
    </Dialog>
  )
}
