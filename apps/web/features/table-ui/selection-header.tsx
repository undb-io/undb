import { Checkbox } from '@egodb/ui'
import type { Table } from '@tanstack/react-table'
import React from 'react'
import { SELECTION_ID } from '../../constants/field.constants'
import type { TData } from './interface'
import { PinnedSelection } from './styles'

export const SelectionHeader: React.FC<{ table: Table<TData> }> = ({ table }) => {
  return (
    <PinnedSelection>
      <th key={SELECTION_ID}>
        <Checkbox
          size="xs"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
          indeterminate={table.getIsSomeRowsSelected()}
        />
      </th>
    </PinnedSelection>
  )
}
