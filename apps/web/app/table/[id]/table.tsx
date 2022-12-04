'use client'

import type { Table as CoreTable, QueryRecords } from '@egodb/core'
import { EGOTable } from '@egodb/table-ui'
import { Box } from '@egodb/ui'
import { CreateRecordFormDrawer } from '../../../components/create-record-form/create-record-form-drawer'
import { TableHaeder } from '../../../components/table/table-header'

interface IProps {
  table: CoreTable
  records: QueryRecords
}

export default function Table({ table, records }: IProps) {
  return (
    <Box>
      <TableHaeder table={table} />
      <EGOTable records={records} table={table} />
      <CreateRecordFormDrawer table={table} />
    </Box>
  )
}
