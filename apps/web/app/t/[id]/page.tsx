'use client'

import { TableFactory } from '@egodb/core'
import { useGetTableQuery } from '@egodb/store'
import type { TRPCError } from '@egodb/trpc'
import { Alert, Container, IconAlertCircle } from '@egodb/ui'
import { TableLoading } from '../../../components/loading'
import Table from './table'

export default function Page({ params: { id } }: { params: { id: string } }) {
  const { data, isLoading, isError, error } = useGetTableQuery({ id })
  if (isLoading) {
    return <TableLoading />
  }

  if (isError) {
    return (
      <Container>
        <Alert icon={<IconAlertCircle size={16} />} title="Oops! Get Table Error!" mt="lg" color="red">
          {(error as TRPCError).message}
        </Alert>
      </Container>
    )
  }

  if (!data) {
    return 'none'
  }
  const table = TableFactory.fromQuery(data)
  return <Table table={table} />
}
