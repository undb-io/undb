import type { Table as CoreTable } from '@egodb/core'
import { Table, Text, UnstyledButton } from '@egodb/ui'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

interface IProps {
  table: CoreTable
}

export const EGOTable: React.FC<IProps> = ({ table }) => {
  // TODO: helper types should infered by type
  const fieldHelper = createColumnHelper<Record<string, string | number>>()
  const fields = table.schema.fields.map((c) => fieldHelper.accessor(c.name.value, { id: c.id.value }))

  const rt = useReactTable({
    data: [],
    columns: fields,
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
        {/* <tbody>
          {rt.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.field.fieldDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {rt.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.field.fieldDef.footer, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </tfoot> */}
      </Table>
    </div>
  )
}
