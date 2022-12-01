import type { IGetTableOutput } from '@egodb/core'
import { Table } from '@egodb/ui'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useReducer } from 'react'

interface IProps {
  table: NonNullable<IGetTableOutput>
}

export const EGOTable: React.FC<IProps> = ({ table }) => {
  const rerender = useReducer(() => ({}), {})[1]
  // TODO: helper types should infered by type
  const columnHelper = createColumnHelper<Record<string, string | number>>()
  const columns = table.columns.map((c) => columnHelper.accessor(c.name, { id: c.id }))

  const rt = useReactTable({
    data: [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="p-2">
      <Table striped highlightOnHover>
        <thead>
          {rt.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        {/* <tbody>
          {rt.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {rt.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </tfoot> */}
      </Table>
      <div className="h-4" />
      <button onClick={() => rerender()} className="border p-2">
        Rerender
      </button>
    </div>
  )
}
