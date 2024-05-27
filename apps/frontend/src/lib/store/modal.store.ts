import { isEmpty, toggle } from "radash"
import { queryParam, ssp } from "sveltekit-search-params"

export const modal = queryParam("modal", ssp.array<string>())

export const CREATE_FIELD_MODAL = "createField" as const
export const DELETE_RECORD_MODAL = "deleteRecord" as const

type ModalType = typeof CREATE_FIELD_MODAL | typeof DELETE_RECORD_MODAL

export const toggleModal = (type: ModalType) => {
  modal.update(($modal) => {
    const modal = toggle($modal ?? [], type)
    return isEmpty(modal) ? null : modal
  })
}

export const closeModal = (type: ModalType) => {
  modal.update(($modal) => {
    return $modal?.filter((m) => m !== type) ?? null
  })
}
