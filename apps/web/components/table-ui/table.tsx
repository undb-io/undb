import { Table } from '@egodb/ui'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { EgoTableContext } from './context'
import type { IProps, TData } from './interface'
import { Thead } from './thead'
import { Tr } from './tr'

export const EGOTable: React.FC<IProps> = ({ table, records }) => {
  if (!table) {
    return null
  }

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
    <EgoTableContext.Provider value={{ table, records }}>
      <div className="p-2">
        <Table
          withBorder
          withColumnBorders
          highlightOnHover
          sx={{
            backgroundColor: 'white',
            'thead tr th': {
              padding: 0,
              ':last-child': {
                paddingLeft: '10px',
                border: 0,
              },
            },
            'tbody tr td': {
              ':last-child': {
                paddingLeft: '10px',
                border: 0,
              },
            },
          }}
        >
          <thead>
            {rt.getHeaderGroups().map((headerGroup) => (
              <Thead headerGroup={headerGroup} key={headerGroup.id} />
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
