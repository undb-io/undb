import type { IShareTarget } from "@undb/share"
import { MaybeConditionGroup } from "@undb/table"
import { getContext, setContext } from "svelte"
import { writable } from "svelte/store"

export interface IShare {
  enabled: boolean
  id: string
  target: IShareTarget
}

export const createShareStore = () => {
  const { subscribe, update } = writable<Map<string, IShare>>(new Map())

  return {
    subscribe,
    set: (id: string, share: IShare) => update((shares) => shares.set(id, share)),
  }
}

export const shareStore = createShareStore()

const shareIdContext = "shareId"

export const setShareId = (shareId: string) => {
  setContext(shareIdContext, shareId)
}

export const getShareId = () => {
  return getContext<string | undefined>(shareIdContext)
}

export const getIsShare = () => {
  return !!getShareId()
}

export const createShareFilterStore = () => {
  const { subscribe, update, set } = writable<MaybeConditionGroup<any> | undefined>(undefined)

  return {
    subscribe,
    set,
    update,
  }
}

export const shareFilterStore = createShareFilterStore()
