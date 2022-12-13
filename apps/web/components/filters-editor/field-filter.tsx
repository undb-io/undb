import type { TableSchema, Field, IFieldValue, IOperator, IFilter } from '@egodb/core'
import { Group } from '@egodb/ui'
import { useEffect, useState } from 'react'
import { FieldSelector } from './field-selector'
import { FilterValueInput } from './filter-value-input'
import { OperatorSelector } from './operator-selector'

interface IProps {
  schema: TableSchema
  index: number
  value: IFilter | null
  onChange: (filter: IFilter | null, index: number) => void
}

export const FieldFilter: React.FC<IProps> = ({ schema, value, onChange, index }) => {
  // TODO: path maybe string list
  const fieldName = value?.path as string
  const field = fieldName ? schema.getField(fieldName).into(null) : null

  const [selectedField, setField] = useState<Field | null>(field)
  const [operator, setOperator] = useState<IOperator | null>(value?.operator ?? null)
  const [fieldValue, setValue] = useState<IFieldValue | null>(value?.value ?? null)

  useEffect(() => {
    if (selectedField && operator) {
      onChange(selectedField.createFilter(operator, fieldValue as any), index)
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
