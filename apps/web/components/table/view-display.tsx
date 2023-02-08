import { CalendarUI } from '../calendar-ui/calendar-ui'
import { KanbanUI } from '../kanban-ui/kanban-ui'
import { TableUI } from '../table-ui/table-ui'
import { TreeViewUI } from '../tree-view-ui/tree-view-ui'
import type { ITableBaseProps } from './table-base-props'

export const ViewDisplay: React.FC<ITableBaseProps> = ({ table }) => {
  const displayType = table.mustGetView().displayType
  if (displayType === 'kanban') {
    return <KanbanUI table={table} />
  }

  if (displayType === 'calendar') {
    return <CalendarUI table={table} />
  }

  if (displayType === 'tree') {
    return <TreeViewUI table={table} />
  }

  return <TableUI table={table} />
}
