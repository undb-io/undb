import type { Field, Table } from '@egodb/core'
import { Select } from '@egodb/ui'
import { FieldIcon } from '../fields/field-Icon'
import { FieldItem } from '../fields/field-item'
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
      value={value?.id.value}
      onChange={(value) => {
        const selectedColumn = value ? schema.getFieldById(value).into(null) : null
        onChange(selectedColumn)
      }}
      placeholder="search field"
      itemComponent={FieldItem}
      data={schema.fields.map((f) => ({
        value: f.id.value,
        label: f.id.value,
        type: f.type,
      }))}
      icon={<FieldIcon type={value?.type} />}
    />
  )
}
