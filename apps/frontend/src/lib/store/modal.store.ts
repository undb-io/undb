import { isEmpty, toggle } from "radash"
import { derived } from "svelte/store"
import { queryParam, ssp } from "sveltekit-search-params"

export const modal = queryParam("modal", ssp.array<string>())

export const CREATE_TABLE_MODAL = "createTable" as const
export const UPDATE_TABLE_MODAL = "updateTable" as const
export const DUPLICATE_TABLE_MODAL = "duplicateTable" as const
export const IMPORT_TABLE_MODAL = "importTable" as const
export const CREATE_RECORD_MODAL = "createRecord" as const
export const DELETE_RECORD_MODAL = "deleteRecord" as const
export const DUPLICATE_RECORD_MODAL = "duplicateRecord" as const
export const CREATE_WEBHOOK_MODAL = "createWebhook" as const
export const CREATE_RLS_MODAL = "createRLS" as const
export const UPDATE_VIEW = "updateView" as const
export const DUPLICATE_VIEW = "duplicateView" as const
export const SET_DEFAULT_VIEW = "setDefaultView" as const
export const DELETE_VIEW = "deleteView" as const
export const CREATE_BASE_MODAL = "createBase" as const
export const DUPLICATE_BASE_MODAL = "duplicateBase" as const
export const UPDATE_BASE_MODAL = "updateBase" as const
export const DELETE_TABLE_MODAL = "deleteTable" as const
export const IMPORT_TEMPLATE_MODAL = "importTemplate" as const
export const VIEW_WIDGET_MODAL = "viewWidget" as const
export const CREATE_DASHBOARD_MODAL = "createDashboard" as const

type ModalType =
  | typeof CREATE_TABLE_MODAL
  | typeof UPDATE_TABLE_MODAL
  | typeof IMPORT_TABLE_MODAL
  | typeof DUPLICATE_TABLE_MODAL
  | typeof DELETE_RECORD_MODAL
  | typeof DUPLICATE_RECORD_MODAL
  | typeof CREATE_RECORD_MODAL
  | typeof CREATE_WEBHOOK_MODAL
  | typeof CREATE_RLS_MODAL
  | typeof UPDATE_VIEW
  | typeof DUPLICATE_VIEW
  | typeof DELETE_VIEW
  | typeof SET_DEFAULT_VIEW
  | typeof CREATE_BASE_MODAL
  | typeof UPDATE_BASE_MODAL
  | typeof DELETE_TABLE_MODAL
  | typeof DUPLICATE_BASE_MODAL
  | typeof IMPORT_TEMPLATE_MODAL
  | typeof VIEW_WIDGET_MODAL
  | typeof CREATE_DASHBOARD_MODAL

export const toggleModal = (type: ModalType) => {
  modal.update(($modal) => {
    const modal = toggle($modal ?? [], type)
    return isEmpty(modal) ? null : modal
  })
}

export const isModalOpen = derived(modal, ($modal) => {
  return (type: ModalType) => $modal?.includes(type) ?? false
})

export const openModal = (type: ModalType) => {
  modal.update(($modal) => {
    return $modal?.includes(type) ? $modal : [...($modal ?? []), type]
  })
}

export const closeModal = (type: ModalType) => {
  modal.update(($modal) => {
    return $modal?.filter((m) => m !== type) ?? null
  })
}
