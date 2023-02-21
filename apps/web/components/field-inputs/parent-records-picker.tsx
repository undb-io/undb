import type { IQueryRecords, ParentField } from '@egodb/core'
import { useLazyParentAvailableQuery } from '@egodb/store'
import type { SelectProps } from '@egodb/ui'
import { Select } from '@egodb/ui'
import { Group } from '@egodb/ui'
import { Loader } from '@egodb/ui'
import { forwardRef, useEffect, useState } from 'react'
import { useCurrentTable } from '../../hooks/use-current-table'
import { RecordValue } from '../field-value/record-value'
import { FieldIcon } from './field-Icon'

interface IProps extends Omit<SelectProps, 'data'> {
  field: ParentField
  recordId?: string
}

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  value: string
  label: string
}

const ParentSelectItem = forwardRef<HTMLDivElement, ItemProps>(({ label, ...others }: ItemProps, ref) => (
  <Group ref={ref} p="xs" {...others}>
    <RecordValue value={label} />
  </Group>
))

export const ParentRecordPicker: React.FC<IProps> = ({ field, recordId, ...rest }) => {
  const [focused, setFocused] = useState(false)
  const [getRecords, { rawRecords, isLoading }] = useLazyParentAvailableQuery({
    selectFromResult: (result) => ({
      ...result,
      rawRecords: (Object.values(result.data?.entities ?? {}) ?? []).filter(Boolean) as IQueryRecords,
    }),
  })

  const table = useCurrentTable()

  useEffect(() => {
    getRecords({ tableId: table.id.value, parentFieldId: field.id.value, recordId })
  }, [focused])

  const data = [
    ...(rawRecords?.map((record) => ({
      value: record.id,
      label: field.getDisplayValues(record.displayValues).toString(),
    })) ?? []),
  ]

  if (rest.value && !data.find((d) => d.value === rest.value)) {
    data.push({ value: rest.value, label: rest.value })
  }

  return (
    <Select
      {...rest}
      multiple
      searchable
      clearable
      description={focused && !rawRecords.length ? 'no more available record to select' : undefined}
      itemComponent={ParentSelectItem}
      data={data}
      onFocus={() => setFocused(true)}
      placeholder={focused && isLoading ? 'loading records...' : undefined}
      disabled={focused && isLoading}
      icon={focused && isLoading ? <Loader color="gray" size={14} /> : <FieldIcon type={field.type} />}
    />
  )
}
