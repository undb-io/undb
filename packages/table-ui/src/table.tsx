import type { QueryRecords, Table as CoreTable } from '@egodb/core'
import { Table } from '@egodb/ui'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { EgoTableContext } from './context'
import type { TData } from './interface'
import { Th } from './th'
import { Tr } from './tr'

interface IProps {
  table: CoreTable
  records: QueryRecords
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRecordClick: (row: any) => void
}

export const EGOTable: React.FC<IProps> = ({ table, records, onRecordClick }) => {
  const fieldHelper = createColumnHelper<TData>()
  const columns = table.schema.fields.map((c) =>
    fieldHelper.accessor(c.name.value, {
      id: c.name.value,
    }),
  )

  const rt = useReactTable({
    data: records.map((r) => r.values),
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <EgoTableContext.Provider value={{ table, records, onRecordClick }}>
      <div className="p-2">
        <Table striped highlightOnHover sx={{ 'thead tr th': { padding: 0 } }}>
          <thead>
            {rt.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th header={header} key={header.id} />
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {rt.getRowModel().rows.map((row) => (
              <Tr row={row} />
            ))}
          </tbody>
        </Table>
      </div>
    </EgoTableContext.Provider>
  )
}
