import { derived, writable } from "svelte/store"

interface Cell {
  recordId: string
  fieldId: string
}

export function createGridViewStore() {
  const { subscribe, update, set } = writable<{
    cell: Cell | null
    count: number
  }>({ cell: null, count: 0 })

  return {
    subscribe,
    select: (readonly: boolean, recordId: string, fieldId: string) => {
      return update((select) => {
        if (!select.cell) {
          return { cell: { recordId, fieldId }, count: 1 }
        }

        if (select.cell.recordId === recordId && select.cell.fieldId === fieldId && !readonly) {
          return { cell: { recordId, fieldId }, count: 2 }
        }

        return { cell: { recordId, fieldId }, count: 1 }
      })
    },
    exitEditing: () => {
      return update((select) => {
        if (select.count === 2) {
          return { cell: select.cell, count: 1 }
        }
        return select
      })
    },
    deselect: () => {
      return set({ cell: null, count: 0 })
    },
  }
}

export const gridViewStore = createGridViewStore()

export const isRowSelected = derived(gridViewStore, ($store) => {
  return ($recordId: string) => {
    return !!$store.cell && $store.cell.recordId === $recordId && $store.count > 0
  }
})

export const isSelectedCell = derived(gridViewStore, ($store) => {
  return ($recordId: string, $fieldId: string) => {
    return !!$store.cell && $store.cell.recordId === $recordId && $store.cell.fieldId === $fieldId && $store.count > 0
  }
})

export const isEditingCell = derived(gridViewStore, ($store) => {
  return ($recordId: string, $fieldId: string) =>
    !!$store.cell && $store.cell.recordId === $recordId && $store.cell.fieldId === $fieldId && $store.count === 2
})
