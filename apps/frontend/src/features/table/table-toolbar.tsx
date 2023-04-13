import { ActionIcon, Divider, Group, IconRefresh, IconSettingsFilled, Tooltip } from '@undb/ui'
import { TableCreateNewRecordButton } from './table-create-new-record-button'
import { ViewFieldsEditor } from './view-fields-editor'
import { TableFilterEditor } from './table-filter-editor'
import { TableSortEditor } from './table-sort-editor'
import { ViewMenu } from './view-menu'
import { ViewsButton } from './views-button'
import { RecordsTotal } from './records-total'
import { useAppSelector } from '../../hooks'
import { getIsLoadedCurrentRecords } from '@undb/store'
import { useTranslation } from 'react-i18next'
import { useFetchRecords } from '../../hooks/use-fetch-records'
import { useSetAtom } from 'jotai'
import { updateTableFormDrawerOpened } from '../update-table-form/drawer-opened.atom'

export const TableToolbar: React.FC = () => {
  const isLoadedRecords = useAppSelector(getIsLoadedCurrentRecords)
  const { t } = useTranslation()
  const { refetch } = useFetchRecords()
  const setUpdateTableOpened = useSetAtom(updateTableFormDrawerOpened)

  return (
    <Group
      px="md"
      h={40}
      spacing="xs"
      position="apart"
      sx={(theme) => {
        const border = '1px solid ' + theme.colors.gray[3]
        return {
          backgroundColor: theme.white,
          borderBottom: border,
          borderTop: border,
        }
      }}
    >
      <Group>
        <ViewsButton />

        <Divider orientation="vertical" />

        <TableCreateNewRecordButton />
        <ViewMenu />
        <TableFilterEditor />
        <TableSortEditor />
        <ViewFieldsEditor />

        {isLoadedRecords && <RecordsTotal />}
      </Group>

      <Group>
        <Tooltip label={t('Force Refresh')}>
          <ActionIcon onClick={() => refetch()}>
            <IconRefresh size={16} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label={t('Update Table')}>
          <ActionIcon onClick={() => setUpdateTableOpened(true)}>
            <IconSettingsFilled size={16} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Group>
  )
}
