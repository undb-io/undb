import { Button, IconFilter } from '@egodb/ui'
import type { ITableBaseProps } from './table-base-props'

export const TableFilterEditor: React.FC<ITableBaseProps> = () => {
  return (
    <Button variant="white" leftIcon={<IconFilter />}>
      Filter
    </Button>
  )
}
