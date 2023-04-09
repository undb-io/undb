import { Divider, Group } from '@undb/ui'
import { TableCreateNewRecordButton } from './table-create-new-record-button'
import { ViewFieldsEditor } from './view-fields-editor'
import { TableFilterEditor } from './table-filter-editor'
import { TableSortEditor } from './table-sort-editor'
import { ViewMenu } from './view-menu'
import { ViewsButton } from './views-button'
import { RecordsTotal } from './records-total'
import { useAppSelector } from '../../hooks'
import { getIsLoadedCurrentRecords } from '@undb/store'

export const TableToolbar: React.FC = () => {
  const isLoadedRecords = useAppSelector(getIsLoadedCurrentRecords)

  return (
    <Group
      px="md"
      h={40}
      spacing="xs"
      sx={(theme) => {
        const border = '1px solid ' + theme.colors.gray[3]
        return {
          backgroundColor: theme.white,
          borderBottom: border,
          borderTop: border,
        }
      }}
    >
      <ViewsButton />

      <Divider orientation="vertical" />

      <TableCreateNewRecordButton />
      <ViewMenu />
      <TableFilterEditor />
      <TableSortEditor />
      <ViewFieldsEditor />

      {isLoadedRecords && <RecordsTotal />}
    </Group>
  )
}
