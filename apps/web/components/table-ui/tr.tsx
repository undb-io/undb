import { flexRender } from '@tanstack/react-table'
import { useSetAtom } from 'jotai'
import { editRecordFormDrawerOpened } from '../edit-record-form/drawer-opened.atom'
import { RecordActions } from './actions'
import type { TRow } from './interface'

export const Tr: React.FC<{ row: TRow }> = ({ row }) => {
  const setOpened = useSetAtom(editRecordFormDrawerOpened)
  return (
    <tr
      key={row.id}
      onClick={() => {
        setOpened(true)
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
      ))}
      <td>
        <RecordActions id={row.id} />
      </td>
    </tr>
  )
}
