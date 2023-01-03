'use client'

import type { Table as CoreTable, QueryRecords } from '@egodb/core'
import { Stack } from '@egodb/ui'
import { CreateFieldModal } from '../../../components/create-field-form/create-field-modal'
import { CreateRecordFormDrawer } from '../../../components/create-record-form/create-record-form-drawer'
import { EditRecordFormDrawer } from '../../../components/edit-record-form/edit-record-form-drawer'
import { TableHaeder } from '../../../components/table/table-header'
import { TableToolbar } from '../../../components/table/table-toolbar'
import { ViewDisplay } from '../../../components/table/view-display'

interface IProps {
  table: CoreTable
  records: QueryRecords
}

export default function Table({ table, records }: IProps) {
  return (
    <Stack h="100%">
      <Stack px="md" pt="sm">
        <TableHaeder table={table} />
        <TableToolbar table={table} />
      </Stack>
      <ViewDisplay table={table} records={records} />
      <CreateRecordFormDrawer table={table} />
      <EditRecordFormDrawer table={table} />
      <CreateFieldModal table={table} />
    </Stack>
  )
}
