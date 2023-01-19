import type { ReferenceField, Table, TreeField } from '@egodb/core'
import { RecordFactory } from '@egodb/core'
import type { MultiSelectProps } from '@egodb/ui'
import { MultiSelect } from '@egodb/ui'
import { trpc } from '../../trpc'

interface IProps extends Omit<MultiSelectProps, 'data'> {
  field: ReferenceField | TreeField
  table: Table
}
export const RecordPicker: React.FC<IProps> = ({ table, field, ...rest }) => {
  const listRecords = trpc.record.list.useQuery({ tableId: table.id.value })

  const records = RecordFactory.fromQueryRecords(listRecords.data?.records ?? [], table.schema.toIdMap())

  const data = records.map((r) => ({ value: r.id.value, label: r.id.value }))
  return <MultiSelect disabled={listRecords.isLoading} multiple clearable searchable data={data} {...rest} />
}
