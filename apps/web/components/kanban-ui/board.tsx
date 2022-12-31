import { SelectField } from '@egodb/core'
import type { IKanbanField } from '@egodb/core/view/kanban.schema'
import type { ITableBaseProps } from '../table/table-base-props'
import { SelectBoard } from './select-board'

interface IProps extends ITableBaseProps {
  field: IKanbanField
}

export const KanbanBoard: React.FC<IProps> = ({ field }) => {
  if (field instanceof SelectField) {
    return <SelectBoard field={field} />
  }

  return <>board</>
}
