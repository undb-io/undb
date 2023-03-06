import { RecordFactory } from '@egodb/core'
import { useGetRecordsQuery } from '@egodb/store'
import dynamic from 'next/dynamic'
import { useTranslation } from 'react-i18next'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'

const EGOTable = dynamic(() => import('./table').then((d) => d.EGOTable))

export const TableUI: React.FC = () => {
  const table = useCurrentTable()
  const view = useCurrentView()
  const { t } = useTranslation()
  const hello = t('hello')
  console.log(hello)

  const { rawRecords } = useGetRecordsQuery(
    { tableId: table.id.value, viewId: view.id.value },
    {
      selectFromResult: (result) => ({
        ...result,
        rawRecords: (Object.values(result.data?.entities ?? {}) ?? []).filter(Boolean),
      }),
      refetchOnFocus: true,
    },
  )

  const records = RecordFactory.fromQueryRecords(rawRecords, table.schema.toIdMap())

  return <EGOTable records={records} />
}
