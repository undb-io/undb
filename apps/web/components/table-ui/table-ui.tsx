import { RecordFactory } from '@egodb/core'
import { useGetRecordsQuery } from '@egodb/store'
import type { ITableBaseProps } from '../table/table-base-props'
import { EGOTable } from './table'

export const TableUI: React.FC<ITableBaseProps> = ({ table }) => {
  const listRecords = useGetRecordsQuery({
    tableId: table.id.value,
  })

  const records = RecordFactory.fromQueryRecords(listRecords.data?.records ?? [], table.schema.toIdMap())

  return <EGOTable table={table} records={records} />
}
