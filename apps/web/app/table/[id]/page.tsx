'use client'

import { Table as CoreTable } from '@egodb/core'
import { Alert, Container, IconAlertCircle, Skeleton } from '@egodb/ui'
import { trpc } from '../../../trpc'
import Table from './table'

export default function Page({ params: { id } }: { params: { id: string } }) {
  const getTable = trpc.table.get.useQuery({ id })
  const records = trpc.record.list.useQuery({ tableId: id })

  if (getTable.isLoading) {
    return <Skeleton h="100vh" />
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

  const table = CoreTable.fromQuery(getTable.data)
  return <Table table={table} records={records.data?.records ?? []} />
}
