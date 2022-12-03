'use client'

import type { Table as CoreTable } from '@egodb/core'
import { EGOTable } from '@egodb/table-ui'
import { Box } from '@egodb/ui'
import { CreateRecordFormDrawer } from '../../../components/create-record-form/create-record-form-drawer'
import { TableHaeder } from '../../../components/table/table-header'

interface IProps {
  table: CoreTable
}

export default function Table({ table }: IProps) {
  return (
    <Box>
      <TableHaeder table={table} />
      <EGOTable table={table} />
      <CreateRecordFormDrawer table={table} />
    </Box>
  )
}
