'use client'

import { TableFactory } from '@egodb/core'
import { getTables } from '@egodb/store'
import { Alert, Container, IconAlertCircle } from '@egodb/ui'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { TableLoading } from '../../../components/loading'
import { trpc } from '../../../trpc'
import Table from './table'

export default function Page({ params: { id } }: { params: { id: string } }) {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getTables())
  }, [dispatch])

  const getTable = trpc.table.get.useQuery({ id })
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
  return <Table table={table} />
}
