import { QueryRecords } from '@egodb/core'
import { Kanban } from '../kanban-ui/kanban'
import { EGOTable } from '../table-ui/table'
import { ITableBaseProps } from './table-base-props'

interface IProps extends ITableBaseProps {
  records: QueryRecords
}

export const TableDisplay: React.FC<IProps> = ({ table, records }) => {
  const displayType = table.mustGetView().displayType
  if (displayType === 'kanban') {
    return <Kanban table={table} records={records} />
  }

  return <EGOTable table={table} records={records} />
}
