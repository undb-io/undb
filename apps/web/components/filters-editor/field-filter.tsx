import type { TableSchema, Field, IFieldValue, IOperator, IFilter } from '@egodb/core'
import { Group, ActionIcon, IconGripVertical, IconTrash } from '@egodb/ui'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEffect, useState } from 'react'
import { FieldSelector } from './field-selector'
import { FilterValueInput } from './filter-value-input'
import { OperatorSelector } from './operator-selector'
import { getFilterId } from './get-filter.id'
import type { Table } from '@egodb/core'

interface IProps {
  table: Table
  schema: TableSchema
  index: number
  value: IFilter | null
  onChange: (filter: IFilter | null, index: number) => void
  onRemove: (index: number) => void
}

export const FieldFilter: React.FC<IProps> = ({ table, schema, value, onChange, onRemove, index }) => {
  // TODO: path maybe string list
  const fieldId = value?.path as string
  const field = fieldId ? schema.getFieldById(fieldId).into(null) : null

  const [selectedField, setField] = useState<Field | null>(field)
  const [operator, setOperator] = useState<IOperator | null>(value?.operator ?? null)
  const [fieldValue, setValue] = useState<IFieldValue | null>((value?.value as never) ?? null)

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: getFilterId(value) })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  useEffect(() => {
    if (selectedField && operator) {
      onChange(selectedField.createFilter(operator as never, fieldValue as never), index)
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
      <FilterValueInput
        table={table}
        field={selectedField}
        value={fieldValue}
        onChange={setValue}
        operator={operator}
      />
      <ActionIcon color="gray.5" variant="outline" onClick={() => onRemove(index)}>
        <IconTrash size={12} />
      </ActionIcon>
    </Group>
  )
}
