import { Button, Group } from '@egodb/ui'
import type { ITableBaseProps } from './table-base-props'
import { TableCreateNewRecordButton } from './table-create-new-record-button'
import { TableFieldVisibilityEditor } from './table-field-visibility-editor'
import { TableFilterEditor } from './table-filter-editor'
import { ToolbarView } from './toolbar-view'

export const TableToolbar: React.FC<ITableBaseProps> = ({ table }) => {
  return (
    <Group
      p="md"
      sx={(theme) => {
        const border = '1px solid ' + theme.colors.gray[3]
        return {
          backgroundColor: theme.white,
          borderBottom: border,
          borderTop: border,
        }
      }}
    >
      <TableCreateNewRecordButton />
      <ToolbarView table={table} />
      <Button.Group>
        <TableFilterEditor table={table} />
        <TableFieldVisibilityEditor table={table} />
      </Button.Group>
    </Group>
  )
}
