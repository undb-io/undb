import type { Records } from '@egodb/core'
import type { IKanbanField } from '@egodb/core'
import type { ITableBaseProps } from '../table/table-base-props'
import { SelectBoard } from './select-board'

interface IProps extends ITableBaseProps {
  field: IKanbanField
  records: Records
}

export const KanbanBoard: React.FC<IProps> = ({ field, table, records }) => {
  if (field.type === 'select') {
    return <SelectBoard field={field} table={table} records={records} />
  }

  return <>board</>
}
