import type { ReferenceField } from '@undb/core'
import { useGetForeignRecordsQuery } from '@undb/store'
import type { MultiSelectProps } from '@undb/ui'
import { useDisclosure } from '@undb/ui'
import { Loader } from '@undb/ui'
import { Group } from '@undb/ui'
import { MultiSelect } from '@undb/ui'
import { forwardRef } from 'react'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useReferenceDisplayValues } from '../../hooks/use-reference-display-values'
import { RecordValue } from '../field-value/record-value'
import { FieldIcon } from './field-Icon'
import { useParams } from 'react-router-dom'

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
  const { recordId } = useParams()
  const table = useCurrentTable()
  const foreignTableId = field.foreignTableId.into() ?? table.id.value

  const [focused, handler] = useDisclosure(false)

  const { rawRecords: foreignRecords, isLoading } = useGetForeignRecordsQuery(
    { tableId: table.id.value, foreignTableId, fieldId: field.id.value },
    {
      skip: !focused,
      selectFromResult: (result) => ({
        ...result,
        rawRecords: (Object.values(result.data?.entities ?? {}) ?? []).filter(Boolean),
      }),
    },
  )

  const data = useReferenceDisplayValues(field, recordId!, foreignRecords)

  return (
    <MultiSelect
      {...rest}
      multiple
      clearable
      searchable
      itemComponent={ReferenceSelectItem}
      description={focused && !isLoading && !foreignRecords.length ? 'no more available record to select' : undefined}
      data={data}
      onFocus={handler.open}
      onBlur={handler.close}
      placeholder={focused && isLoading ? 'loading records...' : undefined}
      disabled={(focused && isLoading) || rest.disabled}
      icon={focused && isLoading ? <Loader color="gray" size={14} /> : <FieldIcon type={field.type} />}
    />
  )
}
