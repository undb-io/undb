import type { Field, FieldValue, RecordAllValueType } from '@egodb/core'
import { Box } from '@egodb/ui'
import type { CellContext } from '@tanstack/react-table'
import { FieldValueFactory } from '../field-value/field-value.factory'
import type { TData } from './interface'
import { usePinnedStyles } from './styles'

interface IProps {
  cell: CellContext<TData, FieldValue>
  field: Field
}
export const Cell: React.FC<IProps> = ({ cell, field }) => {
  const pinned = cell.column.getIsPinned()
  const isLast = cell.column.getPinnedIndex() === cell.table.getLeftLeafHeaders().length - 1

  const header = cell.table.getLeftLeafHeaders()?.find((h) => h.column.id === field.id.value)
  const left = header?.getStart()

  const { classes, cx } = usePinnedStyles({ left })

  let value: RecordAllValueType = undefined

  if (field.type === 'id') {
    value = cell.row.original.id
  } else if (field.type === 'created-at') {
    value = cell.row.original.created_at
  } else if (field.type === 'updated-at') {
    value = cell.row.original.updated_at
  } else if (field.type === 'auto-increment') {
    value = cell.row.original.auto_increment
  } else {
    value = cell.getValue()
  }

  return (
    <Box
      component="td"
      className={cx(classes.cell, { [classes.sticky]: pinned, [classes.last]: isLast })}
      w={cell.column.getSize()}
    >
      <FieldValueFactory field={field} value={value} displayValues={cell.row.original.display_values} />
    </Box>
  )
}
