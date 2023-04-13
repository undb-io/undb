import { RecordFactory } from '@undb/core'
import { useMemo } from 'react'
import { useCurrentTable } from '../../hooks/use-current-table'
import { LoadingTable } from './loading'
import loadable from '@loadable/component'
import { LoadingOverlay, useDebouncedValue } from '@undb/ui'
import { useFetchRecords } from '../../hooks/use-fetch-records'

const EGOTable = loadable(() => import('./table'))

export const TableUI: React.FC = () => {
  const table = useCurrentTable()
  const schema = table.schema.toIdMap()

  const { rawRecords, isLoading, isFetching } = useFetchRecords()
  const records = useMemo(() => RecordFactory.fromQueryRecords(rawRecords, schema), [rawRecords, schema])

  const [deboundedIsFetching] = useDebouncedValue(isFetching, 200)

  if (isLoading) {
    return <LoadingTable />
  }

  return (
    <>
      <LoadingOverlay visible={deboundedIsFetching} />
      <EGOTable records={records} />
    </>
  )
}
