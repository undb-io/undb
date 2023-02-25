import { flexRender } from '@tanstack/react-table'
import type { THeader } from './interface'

export const Thead: React.FC<{ header: THeader }> = ({ header }) => {
  return <th>{flexRender(header.column.columnDef.header, header.getContext())}</th>
}
