import { writable } from "svelte/store"

export interface IShare {
  enabled: boolean
  id: string
}

export const createShareStore = () => {
  const { subscribe, update } = writable<Map<string, IShare>>(new Map())

  return {
    subscribe,
    set: (id: string, share: IShare) => update((shares) => shares.set(id, share)),
  }
}

export const shareStore = createShareStore()
