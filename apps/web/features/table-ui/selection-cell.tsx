import { Checkbox } from '@egodb/ui'
import type { Table } from '@tanstack/react-table'
import React from 'react'
import { SELECTION_ID } from '../../constants/field.constants'
import type { TData } from './interface'

export const SelectionCell: React.FC<{ table: Table<TData> }> = ({ table }) => {
  return (
    <th key={SELECTION_ID} style={{ width: '40px' }}>
      <Checkbox
        size="xs"
        checked={table.getIsAllRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
        indeterminate={table.getIsSomeRowsSelected()}
      />
    </th>
  )
}
