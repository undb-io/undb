import type { Field, ISortDirection, ISortSchema } from '@egodb/core'
import { Group, ActionIcon, IconGripVertical, IconTrash, SegmentedControl } from '@egodb/ui'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEffect, useState } from 'react'
import { FieldSelector } from '../field-inputs/field-selector'
import { getSortId } from './get-sort-id'
import { useTranslation } from 'react-i18next'
import { useOrderedFields } from '../../hooks/use-ordered-fields'

interface IProps {
  index: number
  value: ISortSchema | null
  onChange: (filter: ISortSchema | null, index: number) => void
  onRemove: (index: number) => void
}

export const FieldSort: React.FC<IProps> = ({ value, onChange, onRemove, index }) => {
  const fieldId = value?.fieldId
  const fields = useOrderedFields()
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

  const { t } = useTranslation()

  return (
    <Group ref={setNodeRef} style={style} spacing="xs">
      <ActionIcon {...attributes} {...listeners} component="a">
        <IconGripVertical size={12} />
      </ActionIcon>
      <FieldSelector fields={fields.filter((f) => f.sortable)} value={selectedField} onChange={setField} />
      <SegmentedControl
        size="xs"
        value={direction}
        onChange={(value) => {
          if (value) {
            setDirection(value as ISortDirection)
          }
        }}
        data={[
          { value: 'asc', label: t('Asc', { ns: 'common' }) },
          { value: 'desc', label: t('Desc', { ns: 'common' }) },
        ]}
      />
      <ActionIcon color="gray.5" variant="outline" onClick={() => onRemove(index)}>
        <IconTrash size={12} />
      </ActionIcon>
    </Group>
  )
}
