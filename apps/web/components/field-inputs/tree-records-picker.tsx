import type { Table, TreeField } from '@egodb/core'
import type { MultiSelectProps } from '@egodb/ui'
import { Group } from '@egodb/ui'
import { Loader, MultiSelect } from '@egodb/ui'
import { forwardRef, useState } from 'react'
import { trpc } from '../../trpc'
import { ReferenceItem } from '../reference/reference-item'

interface IProps extends Omit<MultiSelectProps, 'data'> {
  table: Table
  field: TreeField
  recordId?: string
}

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  value: string
  label: string
}

const TreeSelectItem = forwardRef<HTMLDivElement, ItemProps>(({ value, ...others }: ItemProps, ref) => (
  <Group ref={ref} p="xs" {...others}>
    <ReferenceItem value={value} />
  </Group>
))

export const TreeRecordsPicker: React.FC<IProps> = ({ table, field, recordId, ...rest }) => {
  const [focused, setFocused] = useState(false)
  const getRecords = trpc.record.tree.available.useQuery(
    { tableId: table.id.value, treeFieldId: field.id.value, recordId },
    { enabled: focused },
  )

  const data = getRecords.data?.records.map((record) => ({ value: record.id, label: record.id })) ?? []

  return (
    <MultiSelect
      {...rest}
      data={data}
      searchable
      clearable
      itemComponent={TreeSelectItem}
      onFocus={() => setFocused(true)}
      placeholder={focused && getRecords.isLoading ? 'loading records...' : undefined}
      disabled={focused && getRecords.isLoading}
      icon={focused && getRecords.isLoading ? <Loader color="gray" size={14} /> : null}
    />
  )
}
