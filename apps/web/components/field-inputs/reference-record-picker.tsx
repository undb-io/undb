import type { IQueryRecords, ReferenceField } from '@egodb/core'
import { getSelectedRecordId, useGetForeignRecordsQuery, useGetRecordQuery } from '@egodb/store'
import type { MultiSelectProps, SelectItem } from '@egodb/ui'
import { useDisclosure } from '@egodb/ui'
import { Loader } from '@egodb/ui'
import { Group } from '@egodb/ui'
import { MultiSelect } from '@egodb/ui'
import { isEmpty } from '@fxts/core'
import { forwardRef } from 'react'
import { useAppSelector } from '../../hooks'
import { useCurrentTable } from '../../hooks/use-current-table'
import { RecordValue } from '../field-value/record-value'
import { FieldIcon } from './field-Icon'

interface IProps extends Omit<MultiSelectProps, 'data'> {
  field: ReferenceField
}

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  value: string
  label: string
}

const ReferenceSelectItem = forwardRef<HTMLDivElement, ItemProps>(({ label, ...others }: ItemProps, ref) => (
  <Group ref={ref} p="xs" {...others}>
    <RecordValue value={label} />
  </Group>
))

export const ReferenceRecordPicker: React.FC<IProps> = ({ field, ...rest }) => {
  const recordId = useAppSelector(getSelectedRecordId)
  const table = useCurrentTable()
  const foreignTableId = field.foreignTableId.into() ?? table.id.value
  const displayFields = field.displayFieldIds.map((f) => f.value)

  const [focused, handelr] = useDisclosure(false)
  const { data: record } = useGetRecordQuery(
    {
      tableId: table.id.value,
      id: recordId,
    },
    {
      skip: !recordId,
    },
  )

  const { rawRecords: foreignRecords, isLoading } = useGetForeignRecordsQuery(
    { tableId: table.id.value, foreignTableId, fieldId: field.id.value },
    {
      selectFromResult: (result) => ({
        ...result,
        rawRecords: (Object.values(result.data?.entities ?? {}) ?? []).filter(Boolean) as IQueryRecords,
      }),
    },
  )

  // TODO: Encapsulation
  const data: SelectItem[] = []
  if (record) {
    const foreignRecordIds = record.values[field.id.value]
    if (Array.isArray(foreignRecordIds) && !isEmpty(foreignRecordIds)) {
      const values = field.getDisplayValues(record.displayValues)
      for (const [index, foreignRecordId] of foreignRecordIds.entries()) {
        data.push({ value: foreignRecordId as string, label: values[index]?.filter(Boolean).toString() ?? '' })
      }
    }
  }
  for (const foreignRecord of foreignRecords) {
    const values = displayFields.map((fieldId) => foreignRecord.values[fieldId]?.toString())
    data.push({ value: foreignRecord.id, label: values.filter(Boolean).toString() })
  }

  return (
    <MultiSelect
      {...rest}
      multiple
      clearable
      searchable
      itemComponent={ReferenceSelectItem}
      description={focused && !foreignRecords.length ? 'no more available record to select' : undefined}
      data={data}
      onFocus={handelr.open}
      placeholder={focused && isLoading ? 'loading records...' : undefined}
      disabled={focused && isLoading}
      icon={focused && isLoading ? <Loader color="gray" size={14} /> : <FieldIcon type={field.type} />}
    />
  )
}
