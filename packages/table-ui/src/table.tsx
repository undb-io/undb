import type { IFieldValue, QueryRecords, Table as CoreTable } from '@egodb/core'
import { Table, Text, UnstyledButton } from '@egodb/ui'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

interface IProps {
  table: CoreTable
  records: QueryRecords
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  openRecordModal: (row: any) => void
}

export const EGOTable: React.FC<IProps> = ({ table, records, openRecordModal }) => {
  // TODO: helper types should infered by type
  const fieldHelper = createColumnHelper<Record<string, IFieldValue>>()
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
    <div className="p-2">
      <Table striped highlightOnHover sx={{ 'thead tr th': { padding: 0 } }}>
        <thead>
          {rt.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  <UnstyledButton
                    w="100%"
                    h={45}
                    px="lg"
                    sx={(theme) => ({
                      ':hover': { backgroundColor: theme.colors.gray[2] },
                    })}
                  >
                    <Text fz="sm" color="gray.7" fw={500}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </Text>
                  </UnstyledButton>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {rt.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => {
                openRecordModal(row.original)
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
