import type { ReferenceField, Table } from '@egodb/core'
import type { MultiSelectProps } from '@egodb/ui'
import { Loader } from '@egodb/ui'
import { Group } from '@egodb/ui'
import { MultiSelect } from '@egodb/ui'
import { forwardRef, useState } from 'react'
import { trpc } from '../../trpc'
import { ReferenceItem } from '../reference/reference-item'
import { FieldIcon } from './field-Icon'

interface IProps extends Omit<MultiSelectProps, 'data'> {
  field: ReferenceField
  table: Table
}

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  value: string
  label: string
}

const ReferenceSelectItem = forwardRef<HTMLDivElement, ItemProps>(({ value, ...others }: ItemProps, ref) => (
  <Group ref={ref} p="xs" {...others}>
    <ReferenceItem value={value} />
  </Group>
))

export const ReferenceRecordPicker: React.FC<IProps> = ({ table, field, ...rest }) => {
  const [focused, setFocused] = useState(false)
  const listRecords = trpc.record.list.useQuery({ tableId: table.id.value }, { enabled: focused })

  const data = listRecords.data?.records.map((r) => ({ value: r.id, label: r.id })) ?? []

  return (
    <MultiSelect
      {...rest}
      multiple
      clearable
      searchable
      itemComponent={ReferenceSelectItem}
      description={focused && !listRecords.data?.records.length ? 'no more available record to select' : undefined}
      data={data}
      onFocus={() => setFocused(true)}
      placeholder={focused && listRecords.isLoading ? 'loading records...' : undefined}
      disabled={focused && listRecords.isLoading}
      icon={focused && listRecords.isLoading ? <Loader color="gray" size={14} /> : <FieldIcon type={field.type} />}
    />
  )
}
