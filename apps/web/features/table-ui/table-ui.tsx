import { RecordFactory } from '@egodb/core'
import { useGetRecordsQuery } from '@egodb/store'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'
import { LoadingTable } from './loading'

const EGOTable = dynamic(() => import('./table').then((d) => d.EGOTable))

export const TableUI: React.FC = () => {
  const table = useCurrentTable()
  const view = useCurrentView()

  const { data, isLoading } = useGetRecordsQuery({ tableId: table.id.value, viewId: view.id.value })
  const records = useMemo(
    () =>
      RecordFactory.fromQueryRecords(
        (Object.values(data?.entities ?? {}) ?? []).filter(Boolean),
        table.schema.toIdMap(),
      ),
    [data, table.schema],
  )

  if (isLoading) {
    return <LoadingTable />
  }

  return <EGOTable records={records} />
}
