import { useSortable } from '@dnd-kit/sortable'
import type { IQueryRecordSchema } from '@egodb/core'
import { CSS } from '@dnd-kit/utilities'
import { Card, Group } from '@egodb/ui'
import type { SortableProps } from '../sortable.interface'
import type { ITableBaseProps } from '../table/table-base-props'

interface IProps extends ITableBaseProps {
  record: IQueryRecordSchema
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
    <Card py="sm" shadow="xs" radius="sm" {...attributes} {...listeners} ref={setNodeRef} style={style}>
      {Object.entries(record.values).map(([key, value]) => {
        const field = table.schema.getField(key)
        if (field.isNone()) return null
        const f = field.unwrap()
        if (f.type === 'select') {
          return <Group key={key}>{f.options.getById(value as string).mapOr('', (o) => o.name.value)}</Group>
        }
        return <Group key={key}>{value?.toString()}</Group>
      })}
    </Card>
  )
}

export const SortableKanbanCard: React.FC<IProps> = ({ table, record }) => {
  const { attributes, listeners, setNodeRef, isDragging, transform, transition } = useSortable({
    id: record.id,
    data: {
      type: 'card',
    },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: isDragging ? 'grabbing' : 'grab',
    opacity: isDragging ? 0.5 : undefined,
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
