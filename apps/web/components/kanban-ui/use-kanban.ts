import type {
  CollisionDetection,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DropAnimation,
  UniqueIdentifier,
} from '@dnd-kit/core'
import {
  closestCenter,
  defaultDropAnimationSideEffects,
  getFirstCollision,
  pointerWithin,
  rectIntersection,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
}

export interface IUseKanbanProps<TContainer, TItem> {
  containers: UniqueIdentifier[]
  items: Record<string, TItem[]>
  getActiveItem: (id: UniqueIdentifier) => TItem | undefined
  setItems: Dispatch<SetStateAction<Record<string, TItem[]>>>
  getItemId: (item: TItem) => UniqueIdentifier

  getContainer: (id: UniqueIdentifier) => TContainer | undefined

  onDragContainerEnd?: (e: DragEndEvent) => void
  onDragItemEnd?: (e: DragEndEvent, overContainer: UniqueIdentifier) => void
}

export const useKanban = <TContainer, TItem>({
  containers,
  items,
  setItems,
  getItemId,
  getActiveItem,
  getContainer,
  onDragContainerEnd,
  onDragItemEnd,
}: IUseKanbanProps<TContainer, TItem>) => {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const lastOverId = useRef<UniqueIdentifier | null>(null)
  const recentlyMovedToNewContainer = useRef(false)

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
          const containerItems = items[overId]?.map(getItemId) ?? []

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

  const onDragStart: (event: DragStartEvent) => void = (e) => {
    setActiveId(e.active.id)
  }

  const findContainer = (id: UniqueIdentifier) => {
    if (containers.includes(id as string)) {
      return id
    }

    return Object.keys(items).find((containerId) => items[containerId].map(getItemId).includes(id as string))
  }

  const onDragOver: (event: DragOverEvent) => void = (e) => {
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

    setItems((prev) => {
      const activeItems = prev[activeContainer].map(getItemId)
      const overItems = prev[overContainer]?.map(getItemId) ?? []

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
        [activeContainer]: [...prev[activeContainer].filter((item) => getItemId(item) !== active.id)],
        [overContainer]: [
          ...(prev[overContainer]?.slice(0, newIndex) ?? []),
          items[activeContainer][activeIndex],
          ...(prev[overContainer]?.slice(newIndex, prev[overContainer].length) ?? []),
        ],
      }
    })
  }

  const onDragEnd: (event: DragEndEvent) => void = (e) => {
    const { over, active } = e
    if (containers.includes(active.id as string) && over?.id) {
      onDragContainerEnd?.(e)
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
      const activeIndex = items[activeContainer].map(getItemId).indexOf(active.id as string)
      const overIndex = items[overContainer]?.map(getItemId).indexOf(overId as string) ?? -1

      if (activeIndex !== overIndex) {
        setItems((items) => ({
          ...items,
          [overContainer]: arrayMove(items[overContainer] ?? [], activeIndex, overIndex),
        }))
      }
      onDragItemEnd?.(e, overContainer)
    }
    setActiveId(null)
  }

  const isActiveContainer = containers.includes(activeId as string)
  const activeItem = getActiveItem(activeId as string)
  const activeContainer = getContainer(activeId as string)

  return {
    collisionDetectionStrategy,
    dropAnimation,
    onDragStart,
    onDragOver,
    onDragEnd,
    isActiveContainer,
    activeId,
    activeItem,
    activeContainer,
  }
}
