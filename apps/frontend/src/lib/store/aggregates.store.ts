import { derived, writable } from "svelte/store"

type IAggregates = Record<string, string | number | null>

export const createAggregatesStore = () => {
  const store = writable<Record<string, IAggregates>>({})
  const { subscribe, update, set } = store

  const updateTableAggregates = (viewId: string, aggregates: IAggregates) => {
    update((map) => ({ ...map, [viewId]: aggregates }))
  }

  const getTableAggregates = derived(store, ($store) => {
    return (viewId: string) => {
      const aggregates = $store[viewId]
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
