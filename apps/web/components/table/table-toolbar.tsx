import { Group } from '@egodb/ui'
import type { ITableBaseProps } from './table-base-props'
import { TableCreateNewRecordButton } from './table-create-new-record-button'
import { TableFieldVisibilityEditor } from './table-field-visibility-editor'
import { TableFilterEditor } from './table-filter-editor'

export const TableToolbar: React.FC<ITableBaseProps> = ({ table }) => {
  return (
    <Group>
      <TableCreateNewRecordButton />
      <TableFilterEditor table={table} />
      <TableFieldVisibilityEditor table={table} />
    </Group>
  )
}
