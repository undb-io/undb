import {
  getTableHasSelectedRecordIds,
  getTableSelectedRecordIdList,
  getTableSelectedRecordIdsCount,
  resetSelectedRecordIds,
  useBulkDeleteRecordsMutation,
  useBulkDuplicateRecordMutation,
} from '@egodb/store'
import { Dialog, Group, Button, Text, IconDots, Menu, usePrevious, IconTrash, IconCopy } from '@egodb/ui'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector, confirmModal } from '../../hooks'
import { useCurrentTable } from '../../hooks/use-current-table'

export const RecordSelectionDialog: React.FC = () => {
  const table = useCurrentTable()
  const ids = useAppSelector((state) => getTableSelectedRecordIdList(state, table.id.value))
  const hasSelectedRecords = useAppSelector((state) => getTableHasSelectedRecordIds(state, table.id.value))
  const count = useAppSelector((state) => getTableSelectedRecordIdsCount(state, table.id.value))
  const previousCount = usePrevious(count)
  const dispatch = useAppDispatch()

  const [bulkDeleteRecords] = useBulkDeleteRecordsMutation()
  const [bulkdDuplciateRecords] = useBulkDuplicateRecordMutation()

  const confirm = confirmModal({
    async onConfirm() {
      await bulkDeleteRecords({
        tableId: table.id.value,
        ids: ids as [string, ...string[]],
      })
    },
  })

  const { t } = useTranslation()

  return (
    <Dialog
      position={{ left: '50%', bottom: 50 }}
      w={500}
      shadow="lg"
      sx={{ transform: 'translate(-50%, 0) !important' }}
      opened={hasSelectedRecords}
      onClose={() => dispatch(resetSelectedRecordIds())}
      size="lg"
      radius="md"
    >
      <Group position="apart">
        <Group spacing="xs">
          <Text size="sm" fw={500} color="gray.7">
            {t('Selected N Records', { n: count === 0 ? previousCount : count })}
          </Text>
          <Button compact size="xs" color="dark" variant="outline" onClick={() => dispatch(resetSelectedRecordIds())}>
            {t('Reset', { ns: 'common' })}
          </Button>
        </Group>
        <Button.Group>
          <Button
            compact
            size="xs"
            variant="outline"
            leftIcon={<IconCopy size={14} />}
            onClick={() => bulkdDuplciateRecords({ tableId: table.id.value, ids: ids as [string, ...string[]] })}
          >
            {t('Duplicate Selected Record')}
          </Button>
          <Menu position="top">
            <Menu.Target>
              <Button compact size="xs" variant="outline">
                <IconDots size={14} />
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item h="xs" color="red" onClick={confirm} fz="xs" icon={<IconTrash size={14} />}>
                {t('Delete Selected Record')}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Button.Group>
      </Group>
    </Dialog>
  )
}
