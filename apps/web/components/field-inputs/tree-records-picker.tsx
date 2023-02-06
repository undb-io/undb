import type { Table, TreeField } from '@egodb/core'
import { useLazyTreeAvailableQuery } from '@egodb/store'
import type { MultiSelectProps } from '@egodb/ui'
import { Group } from '@egodb/ui'
import { Loader, MultiSelect } from '@egodb/ui'
import { forwardRef, useEffect, useState } from 'react'
import { RecordId } from '../field-value/record-id'
import { FieldIcon } from './field-Icon'

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
    <RecordId id={value} />
    {/* TODO: display values */}
  </Group>
))

export const TreeRecordsPicker: React.FC<IProps> = ({ table, field, recordId, ...rest }) => {
  const [focused, setFocused] = useState(false)
  const [getRecords, { data: getRecordsData, isLoading }] = useLazyTreeAvailableQuery()

  useEffect(() => {
    getRecords({ tableId: table.id.value, treeFieldId: field.id.value, recordId })
  }, [focused])

  const data = [
    ...(getRecordsData?.records.map((record) => ({
      value: record.id,
      values: field.getDisplayValues(record.displayValues),
      label: record.id,
    })) ?? []),
    ...(rest.value?.map((id) => ({ value: id, values: [], label: id })) ?? []),
  ]

  return (
    <MultiSelect
      {...rest}
      multiple
      searchable
      clearable
      description={focused && !getRecordsData?.records.length ? 'no more available record to select' : undefined}
      itemComponent={TreeSelectItem}
      data={data}
      onFocus={() => setFocused(true)}
      placeholder={focused && isLoading ? 'loading records...' : undefined}
      disabled={focused && isLoading}
      icon={focused && isLoading ? <Loader color="gray" size={14} /> : <FieldIcon type={field.type} />}
    />
  )
}
