import { isEmpty, toggle } from "radash"
import { queryParam, ssp } from "sveltekit-search-params"

export const modal = queryParam("modal", ssp.array<string>())

export const CREATE_FIELD_MODAL = "createField" as const

type ModalType = typeof CREATE_FIELD_MODAL

export const toggleModal = (type: ModalType) => {
  modal.update(($modal) => {
    const modal = toggle($modal ?? [], type)
    return isEmpty(modal) ? null : modal
  })
}
