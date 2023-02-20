import type { IQueryRecords, ReferenceField } from '@egodb/core'
import { useGetForeignRecordsQuery } from '@egodb/store'
import type { MultiSelectProps } from '@egodb/ui'
import { useDisclosure } from '@egodb/ui'
import { Loader } from '@egodb/ui'
import { Group } from '@egodb/ui'
import { MultiSelect } from '@egodb/ui'
import { forwardRef } from 'react'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'
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
  const table = useCurrentTable()
  const view = useCurrentView()
  const foreignTableId = field.foreignTableId.into() ?? table.id.value

  const [focused, handelr] = useDisclosure(false)
  const { rawRecords, isLoading } = useGetForeignRecordsQuery(
    { tableId: table.id.value, foreignTableId, fieldId: field.id.value, viewId: view.id.value },
    {
      selectFromResult: (result) => ({
        ...result,
        rawRecords: (Object.values(result.data?.entities ?? {}) ?? []).filter(Boolean) as IQueryRecords,
      }),
    },
  )

  const data = rawRecords.map((r) => ({ value: r.id, label: field.getDisplayValues(r.displayValues).toString() })) ?? []

  return (
    <MultiSelect
      {...rest}
      multiple
      clearable
      searchable
      itemComponent={ReferenceSelectItem}
      description={focused && !rawRecords.length ? 'no more available record to select' : undefined}
      data={data}
      onFocus={handelr.open}
      placeholder={focused && isLoading ? 'loading records...' : undefined}
      disabled={focused && isLoading}
      icon={focused && isLoading ? <Loader color="gray" size={14} /> : <FieldIcon type={field.type} />}
    />
  )
}
