import type {
  TableSchema,
  Field,
  IFieldValue,
  IOperator,
  IFilter,
  IBaseField,
  TextField,
  IStringFilter,
} from '@egodb/core'
import type { BaseField } from '@egodb/core/field/field.base'
import { Group, Select } from '@egodb/ui'
import { atom } from 'jotai'
import { useUpdateAtom } from 'jotai/utils'
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

const selectedFieldAtom = atom<Field | null>(null)
const operatorAtom = atom<IOperator | null>(null)
const setOperatorAtom = atom(null, (_, set, value: IOperator | null) => set(operatorAtom, value))
const fieldValueAtom = atom<IFieldValue | null>(null)
const setFieldValueAtom = atom(null, (_, set, value: IFieldValue | null) => set(fieldValueAtom, value))

type FieldProps<F extends BaseField<IBaseField>, FF extends IFilter> = {
  field: F
  value: FF
  onChange: (filter: IFilter | null) => void
}

const TextSelector: React.FC<FieldProps<TextField, IStringFilter>> = ({ field, value }) => {
  const setOperator = useUpdateAtom(setOperatorAtom)
  return (
    <>
      <Select
        disabled={!field}
        value={value.operator}
        onChange={setOperator}
        data={[
          { value: '$eq', label: 'equal' },
          { value: '$neq', label: 'equal' },
        ]}
      />
      <Select
        disabled={!field}
        value={value.operator}
        onChange={setOperator}
        data={[
          { value: '$eq', label: 'equal' },
          { value: '$neq', label: 'equal' },
        ]}
      />
    </>
  )
}

export const FieldFilter: React.FC<IProps> = ({ schema, value, onChange, index }) => {
  // TODO: better encapsulation of fields

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
