import type { CollisionDetection, DropAnimation, UniqueIdentifier } from '@dnd-kit/core'
import { defaultDropAnimationSideEffects } from '@dnd-kit/core'
import { DragOverlay } from '@dnd-kit/core'
import { getFirstCollision, pointerWithin, rectIntersection } from '@dnd-kit/core'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import type { QueryRecords, SelectField } from '@egodb/core'
import { Container, Group, Modal, useListState } from '@egodb/ui'
import { useAtom } from 'jotai'
import { useCallback, useEffect, useRef, useState } from 'react'
import { trpc } from '../../trpc'
import type { ITableBaseProps } from '../table/table-base-props'
import { openKanbanEditFieldAtom } from './kanban-edit-field.atom'
import { KanbanLane } from './kanban-lane'
import { CreateNewOptionButton } from './create-new-option-button'
import { SelectKanbanField } from './select-kanban-field'
import { CreateNewOptionModal } from './create-new-option-modal'
import { groupBy } from '@fxts/core'
import { KanbanCard } from './kanban-card'

interface IProps extends ITableBaseProps {
  field: SelectField
  records: QueryRecords
}

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
}

export const SelectBoard: React.FC<IProps> = ({ table, field, records }) => {
  const [options, handlers] = useListState(field.options.options)
  const [opened, setOpened] = useAtom(openKanbanEditFieldAtom)

  const groupOptionRecords = () => groupBy((record) => (record.values[field.name.value] as string) || '', records)
  const [optionRecords, setOptionRecords] = useState(groupOptionRecords())

  useEffect(() => {
    handlers.setState(field.options.options)
  }, [field])

  useEffect(() => {
    setOptionRecords(groupOptionRecords())
  }, [records])

  const containers = options.map((o) => o.id.value)
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const reorderOptions = trpc.table.field.select.reorderOptions.useMutation()
  const findContainer = (id: UniqueIdentifier) => {
    if (containers.includes(id as string)) {
      return id
    }

    return Object.keys(optionRecords).find((optionId) =>
      optionRecords[optionId].map((r) => r.id).includes(id as string),
    )
  }

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const lastOverId = useRef<UniqueIdentifier | null>(null)
  const recentlyMovedToNewContainer = useRef(false)

  const activeContainer = options.find((o) => o.id.value === activeId)
  const activeRecord = records.find((r) => r.id === activeId)

  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      if (activeId && activeId in containers) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter((container) => container.id in containers),
        })
      }

      const pointerIntersections = pointerWithin(args)
      const intersections = pointerIntersections.length > 0 ? pointerIntersections : rectIntersection(args)
      let overId = getFirstCollision(intersections, 'id')

      if (overId != null) {
        if (overId in containers) {
          const containerItems = optionRecords[overId].map((r) => r.id)

          if (containerItems.length > 0) {
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) => container.id !== overId && containerItems.includes(container.id as string),
              ),
            })[0]?.id
          }
        }

        lastOverId.current = overId

        return [{ id: overId }]
      }

      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeId, containers],
  )

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false
    })
  }, [containers])

  return (
    <Container fluid ml={0}>
      {opened && (
        <Modal
          target="body"
          withCloseButton={false}
          opened={opened}
          onClose={() => setOpened(false)}
          styles={{ modal: { padding: '0 !important' } }}
        >
          <SelectKanbanField table={table} onSuccess={() => setOpened(false)} />
        </Modal>
      )}

      <Group align="start" noWrap>
        <DndContext
          sensors={sensors}
          onDragStart={(e) => {
            setActiveId(e.active.id)
          }}
          onDragOver={(e) => {
            const { over, active } = e
            const overId = over?.id

            if (overId == null || containers.includes(active.id as string)) {
              return
            }

            const overContainer = findContainer(overId as string)
            const activeContainer = findContainer(active.id as string)
            if (!activeContainer || !overContainer || activeContainer === overContainer) {
              return
            }

            setOptionRecords((prev) => {
              const activeItems = prev[activeContainer].map((r) => r.id)
              const overItems = prev[overContainer].map((r) => r.id)

              // Find the indexes for the items
              const activeIndex = activeItems.indexOf(active.id as string)
              const overIndex = overItems.indexOf(overId as string)

              let newIndex: number

              if (overId in containers) {
                newIndex = overItems.length + 1
              } else {
                const isBelowOverItem =
                  over &&
                  active.rect.current.translated &&
                  active.rect.current.translated.top > over.rect.top + over.rect.height

                const modifier = isBelowOverItem ? 1 : 0

                newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1
              }

              return {
                ...prev,
                [activeContainer]: [...prev[activeContainer].filter((item) => item.id !== active.id)],
                [overContainer]: [
                  ...prev[overContainer].slice(0, newIndex),
                  optionRecords[activeContainer][activeIndex],
                  ...prev[overContainer].slice(newIndex, prev[overContainer].length),
                ],
              }
            })
          }}
          onDragEnd={(e) => {
            const { over, active } = e
            if (containers.includes(active.id as string) && over?.id) {
              handlers.reorder({
                from: active.data.current?.sortable?.index,
                to: over.data.current?.sortable?.index,
              })

              reorderOptions.mutate({
                tableId: table.id.value,
                fieldId: field.id.value,
                from: active.id as string,
                to: over.id as string,
              })
              return
            }
            const activeContainer = findContainer(active.id)

            if (!activeContainer) {
              setActiveId(null)
              return
            }

            const overId = over?.id

            if (overId == null) {
              setActiveId(null)
              return
            }

            const overContainer = findContainer(overId)

            if (overContainer) {
              const activeIndex = optionRecords[activeContainer].map((r) => r.id).indexOf(active.id as string)
              const overIndex = optionRecords[overContainer].map((r) => r.id).indexOf(overId as string)

              if (activeIndex !== overIndex) {
                setOptionRecords((items) => ({
                  ...items,
                  [overContainer]: arrayMove(items[overContainer], activeIndex, overIndex),
                }))
              }
            }
            setActiveId(null)
          }}
          collisionDetection={collisionDetectionStrategy}
        >
          <KanbanLane table={table} field={field} records={optionRecords[''] ?? []} title="uncategorized" id={null} />

          {options.map((option) => (
            <KanbanLane
              field={field}
              table={table}
              records={optionRecords[option.id.value] ?? []}
              key={option.id.value}
              id={option.id.value}
              title={option.name.value}
            />
          ))}

          <DragOverlay adjustScale dropAnimation={dropAnimation}>
            {containers.includes(activeId as string) ? (
              <KanbanLane
                table={table}
                field={field}
                records={records}
                title={activeContainer?.name.value ?? ''}
                id={activeContainer?.id.value ?? ''}
              />
            ) : (
              <KanbanCard record={activeRecord!} table={table} />
            )}
          </DragOverlay>
        </DndContext>

        <CreateNewOptionModal table={table} field={field} />
        <CreateNewOptionButton />
      </Group>
    </Container>
  )
}
