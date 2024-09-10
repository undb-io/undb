import { persisted } from "svelte-persisted-store"
import { derived } from "svelte/store"

interface ICollapsedLanes {
  [key: string]: {
    [key: string]: boolean
  }
}

export const createKanbanStore = () => {
  const store = persisted("undb_kanban", {
    collapsedLanes: {} as ICollapsedLanes,
  })

  const { subscribe, set, update } = store

  const toggleLane = (viewId: string, laneId: string) => {
    update((state) => {
      if (!state.collapsedLanes[viewId]) {
        state.collapsedLanes[viewId] = {}
      }
      state.collapsedLanes[viewId][laneId] = !state.collapsedLanes[viewId][laneId]
      return state
    })
  }

  const getIsLaneCollapsed = derived(
    store,
    ($store) => (viewId: string, laneId: string) => $store.collapsedLanes[viewId]?.[laneId] ?? false,
  )

  return {
    subscribe,
    set,
    update,

    getIsLaneCollapsed,
    toggleLane,
  }
}

export const kanbanStore = createKanbanStore()
