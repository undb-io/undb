import type { QueryRecords } from '@egodb/core'
import { CalendarUI } from '../calendar-ui/calendar-ui'
import { KanbanUI } from '../kanban-ui/kanban-ui'
import { EGOTable } from '../table-ui/table'
import type { ITableBaseProps } from './table-base-props'

interface IProps extends ITableBaseProps {
  records: QueryRecords
}

export const ViewDisplay: React.FC<IProps> = ({ table, records }) => {
  const displayType = table.mustGetView().displayType
  if (displayType === 'kanban') {
    return <KanbanUI table={table} records={records} />
  }

  if (displayType === 'calendar') {
    return <CalendarUI table={table} records={records} />
  }

  return <EGOTable table={table} records={records} />
}
