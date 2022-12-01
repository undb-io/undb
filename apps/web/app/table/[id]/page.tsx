'use client'

import { Alert, Container, IconAlertCircle } from '@egodb/ui'
import { trpc } from '../../../trpc'
import Table from './table'

export default function Page({ params: { id } }: { params: { id: string } }) {
  const getTable = trpc.table.get.useQuery({ id })

  if (getTable.isLoading) {
    return 'loading'
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

  return <Table table={getTable.data} />
}
