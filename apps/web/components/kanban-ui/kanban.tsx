import type { QueryRecords } from '@egodb/core'
import type { ITableBaseProps } from '../table/table-base-props'
import { SelectKanbanField } from './select-kanban-field'

interface IProps extends ITableBaseProps {
  records: QueryRecords
}

export const Kanban: React.FC<IProps> = ({ table }) => {
  const view = table.mustGetView()
  const fieldId = view.kanbanSelectFieldId
  if (fieldId.isNone()) {
    return <SelectKanbanField table={table} />
  }
  return <>kanban</>
}
