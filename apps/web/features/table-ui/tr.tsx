import { setSelectedRecordId } from '@egodb/store'
import { flexRender } from '@tanstack/react-table'
import React from 'react'
import { useAppDispatch } from '../../hooks'
import type { TRow } from './interface'

interface IProps {
  row: TRow
  id: string
}

// eslint-disable-next-line react/display-name
export const Tr: React.FC<IProps> = React.memo(({ row, id }) => {
  const dispatch = useAppDispatch()

  return (
    <tr
      key={row.id}
      onClick={() => {
        dispatch(setSelectedRecordId(id))
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
      ))}
    </tr>
  )
})
