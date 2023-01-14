'use client'

import type { Table as CoreTable } from '@egodb/core'
import type { Records } from '@egodb/core'
import { Stack } from '@egodb/ui'
import { CreateRecordFormDrawer } from '../../../components/create-record-form/create-record-form-drawer'
import { EditRecordFormDrawer } from '../../../components/edit-record-form/edit-record-form-drawer'
import { TableHaeder } from '../../../components/table/table-header'
import { TableToolbar } from '../../../components/table/table-toolbar'
import { ViewDisplay } from '../../../components/table/view-display'

interface IProps {
  table: CoreTable
  records: Records
}

export default function Table({ table, records }: IProps) {
  return (
    <Stack h="100%" spacing={0}>
      <TableHaeder table={table} />
      <TableToolbar table={table} />
      <ViewDisplay table={table} records={records} />
      <CreateRecordFormDrawer table={table} />
      <EditRecordFormDrawer table={table} />
    </Stack>
  )
}
