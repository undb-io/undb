import type { IQueryRecords } from '@egodb/core'
import { RecordFactory } from '@egodb/core'
import { useGetRecordsQuery } from '@egodb/store'
import type { ITableBaseProps } from '../table/table-base-props'
import { EGOTable } from './table'

export const TableUI: React.FC<ITableBaseProps> = ({ table }) => {
  const { rawRecords } = useGetRecordsQuery(
    { tableId: table.id.value },
    {
      selectFromResult: (result) => ({
        ...result,
        rawRecords: (Object.values(result.data?.entities ?? {}) ?? []).filter(Boolean) as IQueryRecords,
      }),
      refetchOnFocus: true,
    },
  )

  const records = RecordFactory.fromQueryRecords(rawRecords, table.schema.toIdMap())

  return <EGOTable table={table} records={records} />
}
