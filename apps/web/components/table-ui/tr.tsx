import { flexRender } from '@tanstack/react-table'
import { useSetAtom } from 'jotai'
import { editRecordFormDrawerOpened } from '../edit-record-form/drawer-opened.atom'
import { editRecordValuesAtom } from '../edit-record-form/edit-record-values.atom'
import type { TRow } from './interface'

interface IProps {
  row: TRow
  id: string
}
export const Tr: React.FC<IProps> = ({ row, id }) => {
  const setOpened = useSetAtom(editRecordFormDrawerOpened)
  const setEditRecordValues = useSetAtom(editRecordValuesAtom)
  return (
    <tr
      key={row.id}
      onClick={() => {
        setEditRecordValues({ id, values: row.original })
        setOpened(true)
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
      ))}
    </tr>
  )
}
