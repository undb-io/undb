import { derived, writable } from "svelte/store"

type IAggregates = Record<string, string | number | null>

export const createAggregatesStore = () => {
  const store = writable<Map<string, IAggregates>>(new Map())
  const { subscribe, update, set } = store

  const updateTableAggregates = (tableId: string, aggregates: IAggregates) => {
    update((map) => map.set(tableId, aggregates))
  }

  const getTableAggregates = derived(store, ($store) => {
    return (tableId: string) => {
      const aggregates = $store.get(tableId)
      return aggregates
    }
  })

  return {
    subscribe,
    update,
    set,
    updateTableAggregates,
    getTableAggregates,
  }
}

export const aggregatesStore = createAggregatesStore()
