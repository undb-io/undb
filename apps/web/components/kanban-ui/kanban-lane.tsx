import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { ActionIcon, Card, Group, IconGripVertical, IconRowInsertTop, Stack, Text } from '@egodb/ui'
import { CSS } from '@dnd-kit/utilities'
import type { QueryRecords, SelectField } from '@egodb/core'
import { SortableKanbanCard } from './kanban-card'
import type { Table } from '@egodb/core'
import { useSetAtom } from 'jotai'
import { createRecordFormDrawerOpened } from '../create-record-form/drawer-opened.atom'
import { createRecordInitialValueAtom } from '../create-record-form/create-record-initial-value.atom'
import type { SortableProps } from '../sortable.interface'
import { UNCATEGORIZED_OPTION_ID } from './kanban.constants'

interface IProps {
  id: string | null
  title: string
  table: Table
  field: SelectField
  records: QueryRecords
}

type IKanbanLaneProps = IProps & SortableProps

export const KanbanLane: React.FC<IKanbanLaneProps> = ({
  id,
  field,
  table,
  setNodeRef,
  setActivatorNodeRef,
  style,
  title,
  attributes = {},
  listeners,
  records,
}) => {
  const setOpened = useSetAtom(createRecordFormDrawerOpened)
  const setCreateRecordInitialValue = useSetAtom(createRecordInitialValueAtom)

  const onCreateRecord = () => {
    setOpened(true)
    if (id) {
      setCreateRecordInitialValue({ [field.name.value]: id === UNCATEGORIZED_OPTION_ID ? null : id })
    }
  }

  const items = records.map((r) => r.id)

  return (
    <Card ref={setNodeRef} withBorder shadow="xs" radius="sm" w={350} style={style}>
      <Card.Section withBorder inheritPadding py="sm">
        <Group position="apart">
          <Text weight={500}>{title}</Text>

          {listeners ? (
            <ActionIcon ref={setActivatorNodeRef} {...listeners} {...attributes}>
              <IconGripVertical size={14} cursor="grab" />
            </ActionIcon>
          ) : null}
        </Group>
      </Card.Section>

      <Card.Section withBorder inheritPadding p="sm" bg="gray.0" mih={400}>
        <Stack>
          <ActionIcon w="100%" color="blue" variant="outline" onClick={onCreateRecord}>
            <IconRowInsertTop />
          </ActionIcon>

          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {records.map((r) => (
              <SortableKanbanCard table={table} record={r} key={r.id} />
            ))}
          </SortableContext>
        </Stack>
      </Card.Section>
    </Card>
  )
}

export const SortableKanbanLane: React.FC<IProps> = ({ table, title, field, id, records }) => {
  const { attributes, listeners, isDragging, setNodeRef, setActivatorNodeRef, transform, transition } = useSortable({
    id: id as string,
    disabled: id === UNCATEGORIZED_OPTION_ID,
    data: {
      type: 'container',
    },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 100 : undefined,
    opacity: isDragging ? 0.5 : undefined,
  }

  return (
    <KanbanLane
      table={table}
      records={records}
      title={title}
      id={id}
      field={field}
      attributes={attributes}
      listeners={listeners}
      setNodeRef={setNodeRef}
      setActivatorNodeRef={setActivatorNodeRef}
      style={style}
    />
  )
}
