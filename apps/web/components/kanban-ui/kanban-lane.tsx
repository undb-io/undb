import { defaultAnimateLayoutChanges, useSortable } from '@dnd-kit/sortable'
import { ActionIcon, Card, Group, IconGripVertical, Text } from '@egodb/ui'
import { CSS } from '@dnd-kit/utilities'
import type { CSSProperties } from 'react'
import type { DraggableAttributes, DraggableSyntheticListeners } from '@dnd-kit/core'

interface IProps {
  id: string
  title: string
}

interface IKanbanLaneProps extends IProps {
  setNodeRef?: (node: HTMLElement | null) => void
  style?: CSSProperties
  attributes?: DraggableAttributes
  listeners?: DraggableSyntheticListeners
}

export const KanbanLane: React.FC<IKanbanLaneProps> = ({
  setNodeRef,
  style,
  title,
  attributes = {},
  listeners = {},
}) => {
  return (
    <Card ref={setNodeRef} style={style} withBorder shadow="xs" radius="sm" w={350}>
      <Card.Section withBorder inheritPadding py="sm">
        <Group position="apart">
          <Text weight={500}>{title}</Text>

          <ActionIcon {...listeners} {...attributes}>
            <IconGripVertical size={14} cursor="grab" />
          </ActionIcon>
        </Group>
      </Card.Section>

      <Card.Section withBorder inheritPadding p="sm" bg="gray.1" mih={400}>
        item
      </Card.Section>
    </Card>
  )
}

export const KanbanLaneDnd: React.FC<IProps> = ({ title, id }) => {
  const { attributes, listeners, isDragging, setNodeRef, transform, transition } = useSortable({
    id,
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
      title={title}
      id={id}
      attributes={attributes}
      listeners={listeners}
      setNodeRef={setNodeRef}
      style={style}
    />
  )
}
