import { useCurrentView } from '../../hooks/use-current-view'
import { CalendarUI } from '../calendar-ui/calendar-ui'
import { KanbanUI } from '../kanban-ui/kanban-ui'
import { TableUI } from '../table-ui/table-ui'
import { TreeViewUI } from '../tree-view-ui/tree-view-ui'

export const ViewDisplay: React.FC = () => {
  const view = useCurrentView()
  const displayType = view.displayType
  if (displayType === 'kanban') {
    return <KanbanUI />
  }

  if (displayType === 'calendar') {
    return <CalendarUI />
  }

  if (displayType === 'tree') {
    return <TreeViewUI />
  }

  return <TableUI />
}
