import type { Field, IFieldValue, IOperator, IRecordOperator, Table } from '@egodb/core'
import { Group } from '@egodb/ui'
import { useEffect, useState } from 'react'
import { FieldSelector } from './field-selector'
import { FilterValueInput } from './filter-value-input'
import { OperatorSelector } from './operator-selector'

interface IProps {
  schema: Table['schema']
  index: number
  onChange: (field: IRecordOperator | null, index: number) => void
}

export const FieldFilter: React.FC<IProps> = ({ schema, onChange, index }) => {
  const [selectedField, setField] = useState<Field | null>(null)
  const [operator, setOperator] = useState<IOperator.LeafOperator | null>(null)
  const [value, setValue] = useState<IFieldValue | null>(null)

  useEffect(() => {
    if (selectedField && operator) {
      onChange(selectedField.createFilter(operator, value), index)
    } else {
      onChange(null, index)
    }
  }, [selectedField, operator, value])

  useEffect(() => {
    if (!selectedField) {
      setOperator(null)
    }
  }, [selectedField])

  return (
    <Group>
      <FieldSelector schema={schema} onChange={setField} />
      <OperatorSelector field={selectedField} value={operator} onChange={setOperator} />
      <FilterValueInput field={selectedField} onChange={setValue} />
    </Group>
  )
}
