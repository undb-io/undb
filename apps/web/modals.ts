import type { ModalsProviderProps } from '@egodb/ui'
import { CreateOptionModal } from './components/create-option-form/create-option-form-modal'
import { UpdateOptionModal } from './components/update-option-form/update-option-modal'

export const UDPATE_OPTION_MODAL_ID = 'UPDATE_OPTION'
export const CREATE_OPTION_MODAL_ID = 'CREAT_OPTION'

export const modals: ModalsProviderProps['modals'] = {
  [UDPATE_OPTION_MODAL_ID]: UpdateOptionModal,
  [CREATE_OPTION_MODAL_ID]: CreateOptionModal,
}
