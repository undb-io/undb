import type { Field, Table } from '@egodb/core'
import { Group, Select, Text } from '@egodb/ui'
import { forwardRef, useState } from 'react'
import { getSchemasIcon } from '../fields/field-Icon'
interface IProps {
  schema: Table['schema']
  value: Field | null
  onChange: (field: Field | null) => void
}

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  field: Field
  label: string
}

export const SelectItem = forwardRef<HTMLDivElement, ItemProps>(({ field, label, ...others }: ItemProps, ref) => {
  return (
    <div ref={ref} {...others}>
      <Group noWrap>
        {getSchemasIcon({ type: field?.type })}
        <Text size="sm">{label}</Text>
      </Group>
    </div>
  )
})

export const FieldSelector: React.FC<IProps> = ({ schema, value, onChange }) => {
  const [selectedColumnType, setSelectedColumnType] = useState<string>()
  return (
    <Select
      searchable
      clearable
      value={value?.name.value}
      onChange={(value) => {
        onChange(value ? schema.getField(value).into(null) : null)
        const selectedColumn = value ? schema.getField(value).into(null) : null

        selectedColumn && setSelectedColumnType(selectedColumn.type)
      }}
      placeholder="search field"
      itemComponent={SelectItem}
      data={schema.fields.map((f) => ({
        value: f.name.value,
        label: f.name.value,
        field: f,
      }))}
      icon={!value ? null : selectedColumnType ? getSchemasIcon({ type: selectedColumnType, size: 16 }) : null}
    />
  )
}
