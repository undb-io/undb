import type { Records } from '@egodb/core'
import type { IKanbanField } from '@egodb/core'
import type { ITableBaseProps } from '../table/table-base-props'
import { KanbanDateBoard } from './kanban-date-board'
import { KanbanSelectBoard } from './kanban-select-board'

interface IProps extends ITableBaseProps {
  field: IKanbanField
  records: Records
}

export const KanbanBoard: React.FC<IProps> = ({ field, table, records }) => {
  if (field.type === 'select') {
    return <KanbanSelectBoard field={field} table={table} records={records} />
  }

  if (field.type === 'date') {
    return <KanbanDateBoard field={field} table={table} records={records} />
  }

  return null
}
