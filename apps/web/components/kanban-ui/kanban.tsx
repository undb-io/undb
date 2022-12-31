import type { QueryRecords } from '@egodb/core'
import type { IKanbanField } from '@egodb/core/view/kanban.schema'
import type { ITableBaseProps } from '../table/table-base-props'
import { KanbanBoard } from './board'
import { SelectKanbanField } from './select-kanban-field'

interface IProps extends ITableBaseProps {
  records: QueryRecords
}

export const Kanban: React.FC<IProps> = ({ table, records }) => {
  const view = table.mustGetView()
  const fieldId = view.kanbanSelectFieldId
  if (fieldId.isNone()) {
    return <SelectKanbanField table={table} />
  }

  const field = table.schema.getFieldById(fieldId.unwrap().value).unwrap()
  return <KanbanBoard table={table} field={field as IKanbanField} records={records} />
}
