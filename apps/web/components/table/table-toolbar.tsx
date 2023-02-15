import { Divider, Group } from '@egodb/ui'
import { TableCreateNewRecordButton } from './table-create-new-record-button'
import { ViewFieldsEditor } from './view-fields-editor'
import { TableFilterEditor } from './table-filter-editor'
import { TableSortEditor } from './table-sort-editor'
import { ToolbarView } from './toolbar-view'
import { ViewsButton } from './views-button'

export const TableToolbar: React.FC = () => {
  return (
    <Group
      px="md"
      py="xs"
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
      <ToolbarView />
      <TableFilterEditor />
      <TableSortEditor />
      <ViewFieldsEditor />
    </Group>
  )
}
