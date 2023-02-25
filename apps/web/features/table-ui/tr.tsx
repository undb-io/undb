import { setSelectedRecordId } from '@egodb/store'
import { flexRender } from '@tanstack/react-table'
import { useAppDispatch } from '../../hooks'
import type { TRow } from './interface'

interface IProps {
  row: TRow
  id: string
}
export const Tr: React.FC<IProps> = ({ row, id }) => {
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
}
