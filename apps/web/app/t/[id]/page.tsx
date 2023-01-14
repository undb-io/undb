'use client'

import { RecordFactory } from '@egodb/core'
import { TableFactory } from '@egodb/core'
import { Alert, Container, IconAlertCircle } from '@egodb/ui'
import { TableLoading } from '../../../components/loading'
import { trpc } from '../../../trpc'
import Table from './table'

export default function Page({ params: { id } }: { params: { id: string } }) {
  const getTable = trpc.table.get.useQuery({ id })
  // FIXME: 不应该在 page 获取 records
  // TODO: 根据不同试图，在 kanban 根据 select id 获取
  const listRecords = trpc.record.list.useQuery({ tableId: id })

  if (getTable.isLoading) {
    return <TableLoading />
  }

  if (getTable.isError) {
    return (
      <Container>
        <Alert icon={<IconAlertCircle size={16} />} title="Oops! Get Table Error!" mt="lg" color="red">
          {getTable.error.message}
        </Alert>
      </Container>
    )
  }

  if (!getTable.data) {
    return 'none'
  }
  const table = TableFactory.fromQuery(getTable.data)
  const records = RecordFactory.fromQueryRecords(listRecords.data?.records ?? [], table.schema.toIdMap())
  return <Table table={table} records={records} />
}
