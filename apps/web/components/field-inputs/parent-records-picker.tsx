import type { IQueryRecords, ParentField } from '@egodb/core'
import {
  getSelectedRecordId,
  useGetForeignRecordsQuery,
  useGetRecordQuery,
  useLazyParentAvailableQuery,
} from '@egodb/store'
import type { SelectItem, SelectProps } from '@egodb/ui'
import { Select } from '@egodb/ui'
import { Group } from '@egodb/ui'
import { Loader } from '@egodb/ui'
import { isEmpty } from '@fxts/core'
import { forwardRef, useEffect, useState } from 'react'
import { useAppSelector } from '../../hooks'
import { useCurrentTable } from '../../hooks/use-current-table'
import { RecordValue } from '../field-value/record-value'
import { FieldIcon } from './field-Icon'

interface IProps extends Omit<SelectProps, 'data'> {
  field: ParentField
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

export const ParentRecordPicker: React.FC<IProps> = ({ field, ...rest }) => {
  const recordId = useAppSelector(getSelectedRecordId)
  const table = useCurrentTable()
  const displayFields = field.displayFieldIds.map((f) => f.value)

  const [focused, setFocused] = useState(false)
  const [getRecords, { rawRecords: foreignRecords, isLoading }] = useLazyParentAvailableQuery({
    selectFromResult: (result) => ({
      ...result,
      rawRecords: (Object.values(result.data?.entities ?? {}) ?? []).filter(Boolean) as IQueryRecords,
    }),
  })

  const { data: record } = useGetRecordQuery(
    {
      tableId: table.id.value,
      id: recordId,
    },
    {
      skip: !recordId,
    },
  )

  useEffect(() => {
    getRecords({ tableId: table.id.value, parentFieldId: field.id.value, recordId })
  }, [focused])

  const data: SelectItem[] = []
  if (record) {
    const foreignRecordIds = record.values[field.id.value]
    if (Array.isArray(foreignRecordIds) && !isEmpty(foreignRecordIds)) {
      const values = field.getDisplayValues(record.displayValues)
      for (const [index, foreignRecordId] of foreignRecordIds.entries()) {
        data.push({ value: foreignRecordId as string, label: values[index]?.toString() ?? '' })
      }
    }
  }
  for (const foreignRecord of foreignRecords) {
    const values = displayFields.map((fieldId) => foreignRecord.values[fieldId]?.toString())
    data.push({ value: foreignRecord.id, label: values.toString() })
  }

  return (
    <Select
      {...rest}
      multiple
      searchable
      clearable
      description={focused && !foreignRecords.length ? 'no more available record to select' : undefined}
      itemComponent={ParentSelectItem}
      data={data}
      onFocus={() => setFocused(true)}
      placeholder={focused && isLoading ? 'loading records...' : undefined}
      disabled={focused && isLoading}
      icon={focused && isLoading ? <Loader color="gray" size={14} /> : <FieldIcon type={field.type} />}
    />
  )
}
