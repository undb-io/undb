'use client'

import type { Table as CoreTable, QueryRecords } from '@egodb/core'
import { EGOTable } from '@egodb/table-ui'
import { Box, NumberInput, openConfirmModal, TextInput, Space } from '@egodb/ui'
import { CreateRecordFormDrawer } from '../../../components/create-record-form/create-record-form-drawer'
import { TableHaeder } from '../../../components/table/table-header'
import { TableToolbar } from '../../../components/table/table-toolbar'

interface IProps {
  table: CoreTable
  records: QueryRecords
}

export default function Table({ table, records }: IProps) {
  const openRecordModal = (row: Record<string, string | number | undefined>) => {
    // TODO: 此处传入的数据结构需要优化，需要了解前端代码表格数据的轮子和数据机构
    const keys = Object.keys(row)
    return openConfirmModal({
      centered: true,
      title: row[keys[0]],
      children: table.schema.fields.map((field, index) => {
        // TODO:需要添加输入之后的 onChange 事件，和提交取消事件
        if (field.type === 'text') {
          return <TextInput label={keys[index]} defaultValue={row[keys[index]]} />
        }
        return <NumberInput label={keys[index]} defaultValue={row[keys[index]] as number} />
      }),
      labels: { confirm: 'submit', cancel: 'cancel' },
      onCancel: () => {
        console.log('cancel')
      },
      onConfirm: () => {
        console.log('comfirm')
      },
    })
  }

  return (
    <Box>
      <TableHaeder table={table} />
      <Box px="md">
        <TableHaeder table={table} />
        <TableToolbar table={table} />
      </Box>
      <Space h="md" />
      <EGOTable openRecordModal={openRecordModal} records={records} table={table} />
      <CreateRecordFormDrawer table={table} />
    </Box>
  )
}
