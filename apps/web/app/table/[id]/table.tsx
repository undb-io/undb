'use client'

import type { Table as CoreTable, QueryRecords } from '@egodb/core'
import { EGOTable } from '@egodb/table-ui'
import { Box, NumberInput, openConfirmModal, TextInput, Space } from '@egodb/ui'
import { useAtom } from 'jotai'
import { CreateRecordFormDrawer } from '../../../components/create-record-form/create-record-form-drawer'
import { editRecordFormDrawerOpened } from '../../../components/edit-record-form/drawer-opened.atom'
import { EditRecordFormDrawer } from '../../../components/edit-record-form/edit-record-form-drawer'
import { TableHaeder } from '../../../components/table/table-header'
import { TableToolbar } from '../../../components/table/table-toolbar'

interface IProps {
  table: CoreTable
  records: QueryRecords
}

export default function Table({ table, records }: IProps) {
  const [, setOpened] = useAtom(editRecordFormDrawerOpened)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rowClick = (row: any) => {
    console.log({ row })
    setOpened(true)
  }

  return (
    <Box>
      <Box px="md">
        <TableHaeder table={table} />
        <TableToolbar table={table} />
      </Box>
      <Space h="md" />
      <EGOTable rowClick={rowClick} records={records} table={table} />
      <CreateRecordFormDrawer table={table} />
      <EditRecordFormDrawer table={table} />
    </Box>
  )
}
