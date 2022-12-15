import type { Field, Table } from '@egodb/core'
import { Select } from '@egodb/ui'

interface IProps {
  schema: Table['schema']
  value: Field | null
  onChange: (field: Field | null) => void
}
export const FieldSelector: React.FC<IProps> = ({ schema, value, onChange }) => {
  return (
    <Select
      searchable
      clearable
      value={value?.name.value}
      onChange={(value) => {
        onChange(value ? schema.getField(value).into(null) : null)
      }}
      placeholder="search field"
      data={schema.fields.map((f) => ({
        value: f.name.value,
        label: f.name.value,
      }))}
    />
  )
}
