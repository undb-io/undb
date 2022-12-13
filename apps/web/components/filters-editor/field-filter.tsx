import type { TableSchema, Field, IFieldValue, IOperator, IFilter } from '@egodb/core'
import { Group, ActionIcon, IconGripVertical, IconTrash } from '@egodb/ui'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEffect, useState } from 'react'
import { FieldSelector } from './field-selector'
import { FilterValueInput } from './filter-value-input'
import { OperatorSelector } from './operator-selector'
import { getFilterId } from './get-filter.id'

interface IProps {
  schema: TableSchema
  index: number
  value: IFilter | null
  onChange: (filter: IFilter | null, index: number) => void
  onRemove: (index: number) => void
}

export const FieldFilter: React.FC<IProps> = ({ schema, value, onChange, onRemove, index }) => {
  // TODO: path maybe string list
  const fieldName = value?.path as string
  const field = fieldName ? schema.getField(fieldName).into(null) : null

  const [selectedField, setField] = useState<Field | null>(field)
  const [operator, setOperator] = useState<IOperator | null>(value?.operator ?? null)
  const [fieldValue, setValue] = useState<IFieldValue | null>(value?.value ?? '')

  console.log(fieldValue)
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: getFilterId(value) })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

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
    <Group ref={setNodeRef} style={style}>
      <ActionIcon {...attributes} {...listeners} component="a">
        <IconGripVertical size={12} />
      </ActionIcon>
      <FieldSelector schema={schema} value={selectedField} onChange={setField} />
      <OperatorSelector field={selectedField} value={operator} onChange={setOperator} />
      <FilterValueInput field={selectedField} value={fieldValue} onChange={setValue} />
      <ActionIcon color="gray.5" variant="outline" onClick={() => onRemove(index)}>
        <IconTrash size={12} />
      </ActionIcon>
    </Group>
  )
}
