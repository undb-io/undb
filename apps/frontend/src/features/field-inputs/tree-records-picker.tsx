import type { TreeField } from '@undb/core'
import { useTreeAvailableQuery } from '@undb/store'
import type { MultiSelectProps } from '@undb/ui'
import { useDisclosure } from '@undb/ui'
import { Group } from '@undb/ui'
import { Loader, MultiSelect } from '@undb/ui'
import { forwardRef } from 'react'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useReferenceDisplayValues } from '../../hooks/use-reference-display-values'
import { RecordValue } from '../field-value/record-value'
import { FieldIcon } from './field-Icon'
import { useParams } from 'react-router-dom'

interface IProps extends Omit<MultiSelectProps, 'data'> {
  field: TreeField
}

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  value: string
  label: string
}

const TreeSelectItem = forwardRef<HTMLDivElement, ItemProps>(({ value, label, ...others }: ItemProps, ref) => (
  <Group key={value} ref={ref} p="xs" {...others}>
    <RecordValue value={label} />
  </Group>
))

export const TreeRecordsPicker: React.FC<IProps> = ({ field, ...rest }) => {
  const { recordId } = useParams()
  const table = useCurrentTable()

  const [focused, handler] = useDisclosure(false)
  const { rawRecords: foreignRecords, isLoading } = useTreeAvailableQuery(
    {
      tableId: table.id.value,
      treeFieldId: field.id.value,
      recordId: recordId || undefined,
    },
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
      searchable
      clearable
      description={focused && !isLoading && !foreignRecords.length ? 'no more available record to select' : undefined}
      itemComponent={TreeSelectItem}
      data={data}
      onFocus={handler.open}
      onBlur={handler.close}
      placeholder={focused && isLoading ? 'loading records...' : undefined}
      disabled={focused && isLoading}
      icon={focused && isLoading ? <Loader color="gray" size={14} /> : <FieldIcon type={field.type} />}
    />
  )
}
