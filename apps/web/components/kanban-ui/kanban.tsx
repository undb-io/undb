import { QueryRecords } from '@egodb/core'
import { ITableBaseProps } from '../table/table-base-props'

interface IProps extends ITableBaseProps {
  records: QueryRecords
}

export const Kanban: React.FC<IProps> = () => {
  return <>kanban</>
}
