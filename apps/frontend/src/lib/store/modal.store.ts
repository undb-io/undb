import { isEmpty, toggle } from "radash"
import { derived } from "svelte/store"
import { queryParam, ssp } from "sveltekit-search-params"

export const modal = queryParam("modal", ssp.array<string>())

export const CREATE_TABLE_MODAL = "createTable" as const
export const CREATE_RECORD_MODAL = "createRecord" as const
export const CREATE_FIELD_MODAL = "createField" as const
export const UPDATE_FIELD_MODAL = "updateField" as const
export const DELETE_RECORD_MODAL = "deleteRecord" as const
export const DUPLICATE_RECORD_MODAL = "duplicateRecord" as const
export const CREATE_WEBHOOK_MODAL = "createWebhook" as const
export const CREATE_RLS_MODAL = "createRLS" as const
export const UPDATE_VIEW = "updateView" as const
export const DUPLICATE_VIEW = "duplicateView" as const
export const DELETE_VIEW = "deleteView" as const
export const CREATE_BASE_MODAL = "createBase" as const

type ModalType =
  | typeof CREATE_TABLE_MODAL
  | typeof CREATE_FIELD_MODAL
  | typeof DELETE_RECORD_MODAL
  | typeof DUPLICATE_RECORD_MODAL
  | typeof CREATE_RECORD_MODAL
  | typeof CREATE_WEBHOOK_MODAL
  | typeof UPDATE_FIELD_MODAL
  | typeof CREATE_RLS_MODAL
  | typeof UPDATE_VIEW
  | typeof DUPLICATE_VIEW
  | typeof DELETE_VIEW
  | typeof CREATE_BASE_MODAL

export const toggleModal = (type: ModalType) => {
  modal.update(($modal) => {
    const modal = toggle($modal ?? [], type)
    return isEmpty(modal) ? null : modal
  })
}

export const isModalOpen = derived(modal, ($modal) => {
  return (type: ModalType) => $modal?.includes(type) ?? false
})

export const closeModal = (type: ModalType) => {
  modal.update(($modal) => {
    return $modal?.filter((m) => m !== type) ?? null
  })
}
