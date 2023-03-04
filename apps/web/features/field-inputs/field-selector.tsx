import type { Field } from '@egodb/core'
import { Select } from '@egodb/ui'
import { FieldIcon } from './field-Icon'
import { FieldItem } from './field-item'
interface IProps {
  fields: Field[]
  value: Field | null
  onChange: (field: Field | null) => void
}

export const FieldSelector: React.FC<IProps> = ({ fields, value, onChange }) => {
  return (
    <Select
      searchable
      clearable
      value={value?.id.value}
      size="xs"
      variant="filled"
      onChange={(value) => {
        const selectedColumn = value ? fields.find((f) => f.id.value === value) ?? null : null
        onChange(selectedColumn)
      }}
      placeholder="search field"
      itemComponent={FieldItem}
      data={fields.map((f) => ({
        value: f.id.value,
        label: f.name.value,
        type: f.type,
      }))}
      icon={value?.type ? <FieldIcon type={value.type} /> : null}
      withinPortal
    />
  )
}
