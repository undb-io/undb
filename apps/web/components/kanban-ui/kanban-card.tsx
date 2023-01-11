import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, Group, Stack, useEgoUITheme } from '@egodb/ui'
import type { SortableProps } from '../sortable.interface'
import type { ITableBaseProps } from '../table/table-base-props'
import type { Record } from '@egodb/core'
import type { SelectFieldValue } from '@egodb/core'
import { Option } from '../option/option'
import type { CSSProperties } from 'react'

interface IProps extends ITableBaseProps {
  record: Record
}

export const KanbanCard: React.FC<IProps & SortableProps> = ({
  table,
  record,
  attributes,
  listeners,
  setNodeRef,
  style,
}) => {
  return (
    <Card py="sm" withBorder shadow="md" radius="xs" {...attributes} {...listeners} ref={setNodeRef} style={style}>
      <Stack spacing="xs">
        {Object.entries(record.values.valueJSON).map(([key, value]) => {
          const field = table.schema.getFieldById(key)
          if (field.isNone()) return null
          const f = field.unwrap()
          if (f.type === 'select') {
            const option = (value as SelectFieldValue).getOption(f).into()
            if (!option) return null

            return (
              <Group key={key}>
                <Option
                  id={option.id.value}
                  name={option.name.value}
                  colorName={option.color.name}
                  shade={option.color.shade}
                />
              </Group>
            )
          }
          return <Group key={key}>{value.unpack()?.toString()}</Group>
        })}
      </Stack>
    </Card>
  )
}

export const SortableKanbanCard: React.FC<IProps> = ({ table, record }) => {
  const { attributes, listeners, setNodeRef, isDragging, transform, transition } = useSortable({
    id: record.id.value,
    data: {
      type: 'card',
    },
  })

  const theme = useEgoUITheme()

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: isDragging ? 'grabbing' : 'grab',
    opacity: isDragging ? 0.5 : undefined,
    boxShadow: isDragging ? theme.shadows.xl : theme.shadows.sm,
  }

  return (
    <KanbanCard
      table={table}
      record={record}
      attributes={attributes}
      listeners={listeners}
      setNodeRef={setNodeRef}
      style={style}
    />
  )
}
