import { setSelectedRecordId } from '@egodb/store'
import { flexRender } from '@tanstack/react-table'
import { useSetAtom } from 'jotai'
import { unstable_batchedUpdates } from 'react-dom'
import { useAppDispatch } from '../../hooks'
import { editRecordFormDrawerOpened } from '../edit-record-form/drawer-opened.atom'
import type { TRow } from './interface'

interface IProps {
  row: TRow
  id: string
}
export const Tr: React.FC<IProps> = ({ row, id }) => {
  const setOpened = useSetAtom(editRecordFormDrawerOpened)

  const dispatch = useAppDispatch()

  return (
    <tr
      key={row.id}
      onClick={() => {
        unstable_batchedUpdates(() => {
          setOpened(true)
          dispatch(setSelectedRecordId(id))
        })
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
      ))}
    </tr>
  )
}
