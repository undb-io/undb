import type { UniqueIdentifier } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import type { RecordAllValues } from '@egodb/core'
import type { FlattenedSortableRecord, SortableRecordItem, SortableRecordItems } from './tree-view-ui.types'

function flatten(
  records: SortableRecordItems,
  parentId: UniqueIdentifier | null = null,
  depth = 0,
): FlattenedSortableRecord[] {
  return records.reduce<FlattenedSortableRecord[]>((acc, item, index) => {
    return [...acc, { ...item, parentId, depth, index }, ...flatten(item.children, item.id, depth + 1)]
  }, [])
}

export function cloneItem(item: SortableRecordItem): SortableRecordItem {
  return {
    id: item.id,
    values: { ...item.values },
    children: item.children.map(cloneItem),
    collapsed: item.collapsed,
  }
}

export function cloneFlattened(item: FlattenedSortableRecord): FlattenedSortableRecord {
  return {
    ...cloneItem(item),
    depth: item.depth,
    parentId: item.parentId,
    index: item.index,
  }
}

export function flattenTree(items: SortableRecordItems): FlattenedSortableRecord[] {
  return flatten(items)
}

export function removeChildrenOf(items: FlattenedSortableRecord[], ids: UniqueIdentifier[]) {
  const excludeParentIds = [...ids]

  return items.filter((item) => {
    if (item.parentId && excludeParentIds.includes(item.parentId)) {
      if (item.children.length) {
        excludeParentIds.push(item.id)
      }
      return false
    }

    return true
  })
}

function getMaxDepth({ previousItem }: { previousItem: FlattenedSortableRecord }) {
  if (previousItem) {
    return previousItem.depth + 1
  }

  return 0
}

function getMinDepth({ nextItem }: { nextItem: FlattenedSortableRecord }) {
  if (nextItem) {
    return nextItem.depth
  }

  return 0
}

function getDragDepth(offset: number, indentationWidth: number) {
  return Math.round(offset / indentationWidth)
}

export function getProjection(
  items: FlattenedSortableRecord[],
  activeId: UniqueIdentifier,
  overId: UniqueIdentifier,
  dragOffset: number,
  indentationWidth: number,
) {
  const overItemIndex = items.findIndex(({ id }) => id === overId)
  const activeItemIndex = items.findIndex(({ id }) => id === activeId)
  const activeItem = items[activeItemIndex]
  const newItems = arrayMove(items, activeItemIndex, overItemIndex)
  const previousItem = newItems[overItemIndex - 1]
  const nextItem = newItems[overItemIndex + 1]
  const dragDepth = getDragDepth(dragOffset, indentationWidth)
  const projectedDepth = activeItem.depth + dragDepth
  const maxDepth = getMaxDepth({
    previousItem,
  })
  const minDepth = getMinDepth({ nextItem })
  let depth = projectedDepth

  if (projectedDepth >= maxDepth) {
    depth = maxDepth
  } else if (projectedDepth < minDepth) {
    depth = minDepth
  }

  return { depth, maxDepth, minDepth, parentId: getParentId() }

  function getParentId() {
    if (depth === 0 || !previousItem) {
      return null
    }

    if (depth === previousItem.depth) {
      return previousItem.parentId
    }

    if (depth > previousItem.depth) {
      return previousItem.id
    }

    const newParent = newItems
      .slice(0, overItemIndex)
      .reverse()
      .find((item) => item.depth === depth)?.parentId

    return newParent ?? null
  }
}

export function removeItem(items: SortableRecordItems, id: UniqueIdentifier) {
  const newItems = []

  for (const item of items) {
    if (item.id === id) {
      continue
    }

    if (item.children.length) {
      item.children = removeItem(item.children, id)
    }

    newItems.push(item)
  }

  return newItems
}

export function findItem(items: SortableRecordItem[], itemId: UniqueIdentifier) {
  return items.find(({ id }) => id === itemId)
}

export function buildTree(flattenedItems: FlattenedSortableRecord[]): SortableRecordItems {
  const root: SortableRecordItem = { id: 'root', values: {} as RecordAllValues, children: [] }
  const nodes: Record<string, SortableRecordItem> = { [root.id]: root }
  const items = flattenedItems.map((item) => ({ ...item, children: [] }))

  for (const item of items) {
    const { id, children } = item
    const parentId = item.parentId ?? root.id
    const parent = nodes[parentId] ?? findItem(items, parentId)

    nodes[id] = { id, values: {} as RecordAllValues, children }
    parent.children.push(item)
  }

  return root.children
}

export function setProperty<T extends keyof SortableRecordItem>(
  items: SortableRecordItems,
  id: UniqueIdentifier,
  property: T,
  setter: (value: SortableRecordItem[T]) => SortableRecordItem[T],
) {
  const cloned = items.map(cloneItem)

  for (const item of cloned) {
    if (item.id === id) {
      item[property] = setter(item[property])
      continue
    }

    if (item.children.length) {
      item.children = setProperty(item.children, id, property, setter)
    }
  }

  return cloned
}

function countChildren(items: SortableRecordItem[], count = 0): number {
  return items.reduce((acc, { children }) => {
    if (children.length) {
      return countChildren(children, acc + 1)
    }

    return acc + 1
  }, count)
}

export function findItemDeep(items: SortableRecordItems, itemId: UniqueIdentifier): SortableRecordItem | undefined {
  for (const item of items) {
    const { id, children } = item

    if (id === itemId) {
      return item
    }

    if (children.length) {
      const child = findItemDeep(children, itemId)

      if (child) {
        return child
      }
    }
  }

  return undefined
}

export function getChildCount(items: SortableRecordItems, id: UniqueIdentifier) {
  const item = findItemDeep(items, id)

  return item ? countChildren(item.children) : 0
}
