import type { Field, ISortDirection, ISortSchema } from '@egodb/core'
import { Group, ActionIcon, IconGripVertical, IconTrash, Select } from '@egodb/ui'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEffect, useState } from 'react'
import type { Table } from '@egodb/core'
import { FieldSelector } from '../field-inputs/field-selector'
import { getSortId } from './get-sort-id'

interface IProps {
  table: Table
  fields: Field[]
  index: number
  value: ISortSchema | null
  onChange: (filter: ISortSchema | null, index: number) => void
  onRemove: (index: number) => void
}

export const FieldSort: React.FC<IProps> = ({ table, fields, value, onChange, onRemove, index }) => {
  // TODO: path maybe string list
  const fieldId = value?.fieldId
  const field = fieldId ? fields.find((f) => f.id.value === fieldId) ?? null : null

  const [selectedField, setField] = useState<Field | null>(field)

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: getSortId(value, index) })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const [direction, setDirection] = useState<ISortDirection>(value?.direction ?? 'asc')

  useEffect(() => {
    if (selectedField) {
      onChange({ fieldId: selectedField.id.value, direction }, index)
    }
  }, [selectedField, direction])

  return (
    <Group ref={setNodeRef} style={style} spacing="xs">
      <ActionIcon {...attributes} {...listeners} component="a">
        <IconGripVertical size={12} />
      </ActionIcon>
      <FieldSelector fields={fields} value={selectedField} onChange={setField} />
      <Select
        size="xs"
        clearable={false}
        searchable={false}
        variant="filled"
        value={direction}
        onChange={(value) => {
          if (value) {
            setDirection(value as ISortDirection)
          }
        }}
        data={[
          { value: 'asc', label: 'A -> Z' },
          { value: 'desc', label: 'Z -> A' },
        ]}
      />
      <ActionIcon color="gray.5" variant="outline" onClick={() => onRemove(index)}>
        <IconTrash size={12} />
      </ActionIcon>
    </Group>
  )
}
