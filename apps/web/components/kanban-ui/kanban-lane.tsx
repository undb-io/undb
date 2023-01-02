import { defaultAnimateLayoutChanges, useSortable } from '@dnd-kit/sortable'
import { ActionIcon, Card, Group, IconGripVertical, IconRowInsertTop, Stack, Text } from '@egodb/ui'
import { CSS } from '@dnd-kit/utilities'
import type { CSSProperties } from 'react'
import { useMemo } from 'react'
import type { DraggableAttributes, DraggableSyntheticListeners } from '@dnd-kit/core'
import type { QueryRecords, SelectField } from '@egodb/core'
import { KanbanCard } from './card'
import type { Table } from '@egodb/core'
import { useSetAtom } from 'jotai'
import { createRecordFormDrawerOpened } from '../create-record-form/drawer-opened.atom'
import { createRecordInitialValueAtom } from '../create-record-form/create-record-initial-value.atom'

interface IProps {
  id: string | null
  title: string
  table: Table
  field: SelectField
  records: QueryRecords
}

interface IKanbanLaneProps extends IProps {
  setNodeRef?: (node: HTMLElement | null) => void
  style?: CSSProperties
  attributes?: DraggableAttributes
  listeners?: DraggableSyntheticListeners
}

export const KanbanLane: React.FC<IKanbanLaneProps> = ({
  id,
  field,
  table,
  setNodeRef,
  style,
  title,
  attributes = {},
  listeners,
  records,
}) => {
  const filteredRecords = useMemo(() => records.filter((r) => r.values[field.name.value] === id), [records])

  const setOpened = useSetAtom(createRecordFormDrawerOpened)
  const setCreateRecordInitialValue = useSetAtom(createRecordInitialValueAtom)

  const onCreateRecord = () => {
    setOpened(true)
    if (id) {
      setCreateRecordInitialValue({ [field.name.value]: id })
    }
  }

  return (
    <Card ref={setNodeRef} style={style} withBorder shadow="xs" radius="sm" w={350}>
      <Card.Section withBorder inheritPadding py="sm">
        <Group position="apart">
          <Text weight={500}>{title}</Text>

          {listeners ? (
            <ActionIcon {...listeners} {...attributes}>
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

          {filteredRecords.map((r) => (
            <KanbanCard table={table} record={r} key={r.id} />
          ))}
        </Stack>
      </Card.Section>
    </Card>
  )
}

export const SortableKanbanLane: React.FC<IProps> = ({ table, title, field, id, records }) => {
  const { attributes, listeners, isDragging, setNodeRef, transform, transition } = useSortable({
    id: id as string,
    animateLayoutChanges: defaultAnimateLayoutChanges,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
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
      style={style}
    />
  )
}
