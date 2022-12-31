import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'
import { horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import type { SelectField } from '@egodb/core'
import { Container, Group, useListState } from '@egodb/ui'
import { useState } from 'react'
import { KanbanLane, KanbanLaneDnd } from './kanban-lane'

interface IProps {
  field: SelectField
}
export const SelectBoard: React.FC<IProps> = ({ field }) => {
  const [options, handlers] = useListState(field.options.options)
  const items = options.map((o) => o.id.value)
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const [activeId, setActiveId] = useState<string | null>(null)
  const active = options.find((o) => o.id.value === activeId)

  return (
    <Container fluid ml={0}>
      <Group>
        <DndContext
          sensors={sensors}
          onDragStart={({ active }) => setActiveId(active.id as string)}
          onDragEnd={(e) => {
            const { over, active } = e
            if (over) {
              handlers.reorder({
                from: active.data.current?.sortable?.index,
                to: over?.data.current?.sortable?.index,
              })
            }
            setActiveId(null)
          }}
          modifiers={[restrictToHorizontalAxis]}
          collisionDetection={closestCenter}
        >
          <SortableContext items={items} strategy={horizontalListSortingStrategy}>
            {options.map((option) => (
              <KanbanLaneDnd key={option.id.value} id={option.id.value} title={option.name.value} />
            ))}
          </SortableContext>
          <DragOverlay>
            <KanbanLane title={active ? active.name.value : ''} id={active ? active.id.value : ''} />
          </DragOverlay>
        </DndContext>
      </Group>
    </Container>
  )
}
