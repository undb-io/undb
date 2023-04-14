import type { Field, FieldValue, RecordAllValueType } from '@undb/core'
import { Box } from '@undb/ui'
import type { CellContext } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import { FieldValueFactory } from '../field-value/field-value.factory'
import type { TData } from './interface'
import { usePinnedStyles } from './styles'

interface IProps {
  cell: CellContext<TData, FieldValue>
  field: Field
}

export const Cell: React.FC<IProps> = ({ cell, field }) => {
  const pinned = cell.column.getIsPinned()

  const isLast = useMemo(
    () => (pinned ? cell.column.getPinnedIndex() === cell.table.getLeftLeafHeaders().length - 1 : undefined),
    [],
  )

  const left = useMemo(
    () =>
      cell.table
        .getFlatHeaders()
        ?.find((h) => h.column.id === field.id.value)
        ?.getStart(),
    [],
  )

  const { classes, cx } = usePinnedStyles({ left })

  let value: RecordAllValueType = undefined

  if (field.type === 'id') {
    value = cell.row.original.id
  } else if (field.type === 'created-at') {
    value = cell.row.original.created_at
  } else if (field.type === 'created-by') {
    value = cell.row.original.created_by_profile
  } else if (field.type === 'updated-at') {
    value = cell.row.original.updated_at
  } else if (field.type === 'updated-by') {
    value = cell.row.original.updated_by_profile
  } else if (field.type === 'auto-increment') {
    value = cell.row.original.auto_increment
  } else {
    value = cell.getValue()
  }

  return (
    <Box
      component="td"
      className={cx(classes.cell, { [classes.sticky]: pinned, [classes.last]: isLast })}
      h="32px"
      w={cell.column.getSize() + 'px'}
      sx={{ position: pinned ? 'sticky' : 'absolute', left }}
    >
      <FieldValueFactory field={field} value={value} displayValues={cell.row.original.display_values} />
    </Box>
  )
}
