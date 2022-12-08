'use client'

import type { Table as CoreTable, QueryRecords } from '@egodb/core'
import { EGOTable } from '@egodb/table-ui'
import { Box, Space } from '@egodb/ui'
import { CreateRecordFormDrawer } from '../../../components/create-record-form/create-record-form-drawer'
import { TableHaeder } from '../../../components/table/table-header'
import { TableToolbar } from '../../../components/table/table-toolbar'

interface IProps {
  table: CoreTable
  records: QueryRecords
}

export default function Table({ table, records }: IProps) {
  return (
    <Box>
      <Box px="md">
        <TableHaeder table={table} />
        <TableToolbar table={table} />
      </Box>
      <Space h="md" />
      <EGOTable records={records} table={table} />
      <CreateRecordFormDrawer table={table} />
    </Box>
  )
}
