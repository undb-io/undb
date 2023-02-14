import type { IQueryRecords, ReferenceField } from '@egodb/core'
import { useLazyGetRecordsQuery } from '@egodb/store'
import type { MultiSelectProps } from '@egodb/ui'
import { Loader } from '@egodb/ui'
import { Group } from '@egodb/ui'
import { MultiSelect } from '@egodb/ui'
import { forwardRef, useEffect, useState } from 'react'
import { useCurrentTable } from '../../hooks/use-current-table'
import { RecordId } from '../field-value/record-id'
import { FieldIcon } from './field-Icon'

interface IProps extends Omit<MultiSelectProps, 'data'> {
  field: ReferenceField
}

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  value: string
  label: string
}

const ReferenceSelectItem = forwardRef<HTMLDivElement, ItemProps>(({ value, ...others }: ItemProps, ref) => (
  <Group ref={ref} p="xs" {...others}>
    <RecordId id={value} />
  </Group>
))

export const ReferenceRecordPicker: React.FC<IProps> = ({ field, ...rest }) => {
  const [focused, setFocused] = useState(false)
  const [listRecords, { rawRecords, isLoading }] = useLazyGetRecordsQuery({
    selectFromResult: (result) => ({
      ...result,
      rawRecords: (Object.values(result.data?.entities ?? {}) ?? []).filter(Boolean) as IQueryRecords,
    }),
  })

  const table = useCurrentTable()

  useEffect(() => {
    listRecords({ tableId: table.id.value })
  }, [focused])

  const data = rawRecords.map((r) => ({ value: r.id, label: r.id })) ?? []

  return (
    <MultiSelect
      {...rest}
      multiple
      clearable
      searchable
      itemComponent={ReferenceSelectItem}
      description={focused && !rawRecords.length ? 'no more available record to select' : undefined}
      data={data}
      onFocus={() => setFocused(true)}
      placeholder={focused && isLoading ? 'loading records...' : undefined}
      disabled={focused && isLoading}
      icon={focused && isLoading ? <Loader color="gray" size={14} /> : <FieldIcon type={field.type} />}
    />
  )
}
