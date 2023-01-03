import type { QueryRecords } from '@egodb/core'
import { CalendarUI } from '../calendar-ui/calendar-ui'
import { Kanban } from '../kanban-ui/kanban'
import { EGOTable } from '../table-ui/table'
import type { ITableBaseProps } from './table-base-props'

interface IProps extends ITableBaseProps {
  records: QueryRecords
}

export const ViewDisplay: React.FC<IProps> = ({ table, records }) => {
  const displayType = table.mustGetView().displayType
  if (displayType === 'kanban') {
    return <Kanban table={table} records={records} />
  }

  if (displayType === 'calendar') {
    return <CalendarUI table={table} records={records} />
  }

  return <EGOTable table={table} records={records} />
}
