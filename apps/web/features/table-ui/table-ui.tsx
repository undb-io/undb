import { RecordFactory } from '@egodb/core'
import { useGetRecordsQuery } from '@egodb/store'
import dynamic from 'next/dynamic'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'

const EGOTable = dynamic(() => import('./table').then((d) => d.EGOTable))

export const TableUI: React.FC = () => {
  const table = useCurrentTable()
  const view = useCurrentView()

  const { records } = useGetRecordsQuery(
    { tableId: table.id.value, viewId: view.id.value },
    {
      selectFromResult: (result) => {
        const rawRecords = (Object.values(result.data?.entities ?? {}) ?? []).filter(Boolean)
        const records = RecordFactory.fromQueryRecords(rawRecords, table.schema.toIdMap())
        return {
          ...result,
          rawRecords,
          records,
        }
      },
      refetchOnFocus: true,
    },
  )

  return <EGOTable records={records} />
}
