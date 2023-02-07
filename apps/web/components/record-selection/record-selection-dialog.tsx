import { getHasSelectedRecordIds, getSelectedRecordIdsCount, resetSelectedRecordIds } from '@egodb/store'
import { Dialog, Group, Button, Text } from '@egodb/ui'
import { useAppDispatch, useAppSelector } from '../../hooks'

export const RecordSelectionDialog = () => {
  const hasSelectedRecords = useAppSelector(getHasSelectedRecordIds)
  const count = useAppSelector(getSelectedRecordIdsCount)
  const dispatch = useAppDispatch()

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
        <Button compact size="xs" color="red" variant="subtle" onClick={() => dispatch(resetSelectedRecordIds())}>
          Delete Selected
        </Button>
      </Group>
    </Dialog>
  )
}
