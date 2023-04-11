import { RecordFactory } from '@undb/core'
import { useGetRecordsQuery } from '@undb/store'
import { useMemo } from 'react'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'
import { LoadingTable } from './loading'
import loadable from '@loadable/component'
import { LoadingOverlay, useDebouncedValue } from '@undb/ui'

const EGOTable = loadable(() => import('./table'))

export const TableUI: React.FC = () => {
  const table = useCurrentTable()
  const schema = table.schema.toIdMap()
  const view = useCurrentView()

  const { data, isLoading, isFetching } = useGetRecordsQuery({ tableId: table.id.value, viewId: view.id.value })
  const records = useMemo(
    () => RecordFactory.fromQueryRecords((Object.values(data?.entities ?? {}) ?? []).filter(Boolean), schema),
    [data, schema],
  )

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
