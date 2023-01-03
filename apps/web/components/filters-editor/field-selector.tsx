import type { Field, Table } from '@egodb/core'
import { Select } from '@egodb/ui'
import { useState } from 'react'
import { getSchemasIcon, SelectItem } from '../fields/schemas-select-icon'
interface IProps {
  schema: Table['schema']
  value: Field | null
  onChange: (field: Field | null) => void
}
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
        type: f.type,
      }))}
      icon={!value ? null : selectedColumnType ? getSchemasIcon(selectedColumnType) : null}
    />
  )
}
