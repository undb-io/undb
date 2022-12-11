import type { Field, IFieldValue, IFilter, IOperator, IRecordOperator, TableSchema } from '@egodb/core'
import { Group } from '@egodb/ui'
import { useEffect, useState } from 'react'
import { FieldSelector } from './field-selector'
import { FilterValueInput } from './filter-value-input'
import { OperatorSelector } from './operator-selector'

interface IProps {
  schema: TableSchema
  index: number
  value: IFilter | null
  onChange: (field: IRecordOperator | null, index: number) => void
}

export const FieldFilter: React.FC<IProps> = ({ schema, value, onChange, index }) => {
  // TODO: better encapsulation of fields
  const v = value ? Object.values(value)[0] : null
  const fieldName = value ? Object.keys(value)[0] : null
  const field = fieldName ? schema.getField(fieldName).into(null) : null

  const [selectedField, setField] = useState<Field | null>(field)
  const initialOperaotr = v ? (Object.keys(v)[0] as IOperator.LeafOperator) : null
  const [operator, setOperator] = useState<IOperator.LeafOperator | null>(initialOperaotr)

  const initialFieldValue = v ? Object.values(v)[0] : null
  const [fieldValue, setValue] = useState<IFieldValue | null>(initialFieldValue as IFieldValue)

  useEffect(() => {
    if (selectedField && operator) {
      onChange(selectedField.createFilter(operator, fieldValue), index)
    } else {
      onChange(null, index)
    }
  }, [selectedField, operator, fieldValue])

  useEffect(() => {
    if (!selectedField) {
      setOperator(null)
    }
  }, [selectedField])

  return (
    <Group>
      <FieldSelector schema={schema} value={selectedField} onChange={setField} />
      <OperatorSelector field={selectedField} value={operator} onChange={setOperator} />
      <FilterValueInput field={selectedField} value={fieldValue} onChange={setValue} />
    </Group>
  )
}
