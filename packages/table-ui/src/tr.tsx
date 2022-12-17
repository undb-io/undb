import { flexRender } from '@tanstack/react-table'
import { useEgoTableContext } from './context'
import type { TRow } from './interface'

export const Tr: React.FC<{ row: TRow }> = ({ row }) => {
  const { onRecordClick } = useEgoTableContext()
  return (
    <tr
      key={row.id}
      onClick={() => {
        onRecordClick?.(row.id)
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
      ))}
    </tr>
  )
}
