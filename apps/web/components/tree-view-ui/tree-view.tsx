import type {
  Announcements,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragStartEvent,
  DropAnimation,
  Modifier,
  UniqueIdentifier,
} from '@dnd-kit/core'
import { MouseSensor } from '@dnd-kit/core'
import { defaultDropAnimation, MeasuringStrategy } from '@dnd-kit/core'
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { IQueryTreeRecord, IQueryTreeRecords, Table, TreeField } from '@egodb/core'
import type { TableSchemaIdMap } from '@egodb/core'
import { RecordFactory } from '@egodb/core'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { trpc } from '../../trpc'
import { sortableTreeKeyboardCoordinates } from './keyboard-coordinates'
import { SortableTreeItem } from './sortable-tree-view-item'
import type {
  FlattenedSortableRecord,
  SensorContext,
  SortableRecordItem,
  SortableRecordItems,
} from './tree-view-ui.types'
import {
  flattenTree,
  removeChildrenOf,
  getProjection,
  removeItem,
  setProperty,
  getChildCount,
  buildTree,
  cloneFlattened,
} from './tree-view-ui.util'

interface IProps {
  table: Table
  field: TreeField
  records: IQueryTreeRecords
  indentationWidth?: number
}

const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
}

const dropAnimationConfig: DropAnimation = {
  keyframes({ transform }) {
    return [
      { opacity: 1, transform: CSS.Transform.toString(transform.initial) },
      {
        opacity: 0,
        transform: CSS.Transform.toString({
          ...transform.final,
          x: transform.final.x + 5,
          y: transform.final.y + 5,
        }),
      },
    ]
  },
  easing: 'ease-out',
  sideEffects({ active }) {
    active.node.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: defaultDropAnimation.duration,
      easing: defaultDropAnimation.easing,
    })
  },
}

const adjustTranslate: Modifier = ({ transform }) => {
  return {
    ...transform,
    y: transform.y - 25,
  }
}
const mapper = (schema: TableSchemaIdMap, record: IQueryTreeRecord): SortableRecordItem => {
  const r = RecordFactory.fromQuery(record, schema).unwrap()
  return {
    id: r.id.value,
    values: r.valuesJSON,
    children: record.children.map((r) => mapper(schema, r)),
  }
}

export const TreeView: React.FC<IProps> = ({ table, field, indentationWidth = 50, records }) => {
  const updateRecord = trpc.record.update.useMutation({})
  const schema = table.schema.toIdMap()

  const [items, setItems] = useState<SortableRecordItems>(() => {
    return records.map((r) => mapper(schema, r))
  })

  useEffect(() => {
    setItems(records.map((r) => mapper(schema, r)))
  }, [records])

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null)
  const [offsetLeft, setOffsetLeft] = useState(0)
  const [currentPosition, setCurrentPosition] = useState<{
    parentId: UniqueIdentifier | null
    overId: UniqueIdentifier
  } | null>(null)

  const flattenedItems = useMemo(() => {
    const flattenedTree = flattenTree(items)
    const collapsedItems = flattenedTree.reduce<string[]>(
      (acc, { children, collapsed, id }) => (collapsed && children.length ? ([...acc, id] as string[]) : acc),
      [],
    )

    return removeChildrenOf(flattenedTree, activeId ? [activeId, ...collapsedItems] : collapsedItems)
  }, [activeId, items])
  const projected =
    activeId && overId ? getProjection(flattenedItems, activeId, overId, offsetLeft, indentationWidth) : null
  const sensorContext: SensorContext = useRef({
    items: flattenedItems,
    offset: offsetLeft,
  })
  const [coordinateGetter] = useState(() => sortableTreeKeyboardCoordinates(sensorContext, indentationWidth))
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    }),
  )

  const sortedIds = useMemo(() => flattenedItems.map(({ id }) => id), [flattenedItems])
  const activeItem = activeId ? flattenedItems.find(({ id }) => id === activeId) : null

  useEffect(() => {
    sensorContext.current = {
      items: flattenedItems,
      offset: offsetLeft,
    }
  }, [flattenedItems, offsetLeft])

  const announcements: Announcements = {
    onDragStart({ active }) {
      return `Picked up ${active.id}.`
    },
    onDragMove({ active, over }) {
      return getMovementAnnouncement('onDragMove', active.id, over?.id)
    },
    onDragOver({ active, over }) {
      return getMovementAnnouncement('onDragOver', active.id, over?.id)
    },
    onDragEnd({ active, over }) {
      return getMovementAnnouncement('onDragEnd', active.id, over?.id)
    },
    onDragCancel({ active }) {
      return `Moving was cancelled. ${active.id} was dropped in its original position.`
    },
  }

  return (
    <DndContext
      accessibility={{ announcements }}
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={measuring}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
        {flattenedItems.map(({ id, children, values, collapsed, depth }) => (
          <SortableTreeItem
            table={table}
            field={field}
            values={values}
            key={id}
            id={id}
            depth={id === activeId && projected ? projected.depth : depth}
            indentationWidth={indentationWidth}
            collapsed={Boolean(collapsed && children.length)}
            onCollapse={children.length ? () => handleCollapse(id) : undefined}
            onRemove={() => handleRemove(id)}
          />
        ))}
        {createPortal(
          <DragOverlay dropAnimation={dropAnimationConfig} modifiers={[adjustTranslate]}>
            {activeId && activeItem ? (
              <SortableTreeItem
                table={table}
                field={field}
                id={activeId}
                values={activeItem.values}
                depth={activeItem.depth}
                clone
                childCount={getChildCount(items, activeId) + 1}
                indentationWidth={indentationWidth}
              />
            ) : null}
          </DragOverlay>,
          document.body,
        )}
      </SortableContext>
    </DndContext>
  )

  function handleDragStart({ active: { id: activeId } }: DragStartEvent) {
    setActiveId(activeId)
    setOverId(activeId)

    const activeItem = flattenedItems.find(({ id }) => id === activeId)

    if (activeItem) {
      setCurrentPosition({
        parentId: activeItem.parentId,
        overId: activeId,
      })
    }

    document.body.style.setProperty('cursor', 'grabbing')
  }

  function handleDragMove({ delta }: DragMoveEvent) {
    setOffsetLeft(delta.x)
  }

  function handleDragOver({ over }: DragOverEvent) {
    setOverId(over?.id ?? null)
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    resetState()

    if (projected && over) {
      const { depth, parentId } = projected
      const clonedItems: FlattenedSortableRecord[] = flattenTree(items).map(cloneFlattened)
      const overIndex = clonedItems.findIndex(({ id }) => id === over.id)
      const activeIndex = clonedItems.findIndex(({ id }) => id === active.id)
      const activeTreeItem = clonedItems[activeIndex]

      clonedItems[activeIndex] = { ...activeTreeItem, depth, parentId }

      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex)
      const newItems = buildTree(sortedItems)

      setItems(newItems)

      if (field.parentFieldId) {
        updateRecord.mutate({
          tableId: table.id.value,
          id: activeId as string,
          value: [{ id: field.parentFieldId.value, value: parentId }],
        })
      }
    }
  }

  function handleDragCancel() {
    resetState()
  }

  function resetState() {
    setOverId(null)
    setActiveId(null)
    setOffsetLeft(0)
    setCurrentPosition(null)

    document.body.style.setProperty('cursor', '')
  }

  function handleRemove(id: UniqueIdentifier) {
    setItems((items) => removeItem(items, id))
  }

  function handleCollapse(id: UniqueIdentifier) {
    setItems((items) => setProperty(items, id, 'collapsed', (value) => !value))
  }

  function getMovementAnnouncement(eventName: string, activeId: UniqueIdentifier, overId?: UniqueIdentifier) {
    if (overId && projected) {
      if (eventName !== 'onDragEnd') {
        if (currentPosition && projected.parentId === currentPosition.parentId && overId === currentPosition.overId) {
          return
        } else {
          setCurrentPosition({
            parentId: projected.parentId,
            overId,
          })
        }
      }

      const clonedItems: FlattenedSortableRecord[] = flattenTree(items).map(cloneFlattened)
      const overIndex = clonedItems.findIndex(({ id }) => id === overId)
      const activeIndex = clonedItems.findIndex(({ id }) => id === activeId)
      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex)

      const previousItem = sortedItems[overIndex - 1]

      let announcement
      const movedVerb = eventName === 'onDragEnd' ? 'dropped' : 'moved'
      const nestedVerb = eventName === 'onDragEnd' ? 'dropped' : 'nested'

      if (!previousItem) {
        const nextItem = sortedItems[overIndex + 1]
        announcement = `${activeId} was ${movedVerb} before ${nextItem?.id}.`
      } else {
        if (projected.depth > previousItem.depth) {
          announcement = `${activeId} was ${nestedVerb} under ${previousItem.id}.`
        } else {
          let previousSibling: FlattenedSortableRecord | undefined = previousItem
          while (previousSibling && projected.depth < previousSibling.depth) {
            const parentId: UniqueIdentifier | null = previousSibling.parentId
            previousSibling = sortedItems.find(({ id }) => id === parentId)
          }

          if (previousSibling) {
            announcement = `${activeId} was ${movedVerb} after ${previousSibling.id}.`
          }
        }
      }

      return announcement
    }

    return
  }
}
