import type { Field, Table } from '@egodb/core'
import { Select } from '@egodb/ui'
import { FieldInputLabel } from '../fields/field-input-label'

interface IProps {
  schema: Table['schema']
  onChange: (field: Field | null) => void
}
export const FieldSelector: React.FC<IProps> = ({ schema, onChange }) => {
  return (
    <Select
      label={<FieldInputLabel>Field</FieldInputLabel>}
      searchable
      clearable
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
