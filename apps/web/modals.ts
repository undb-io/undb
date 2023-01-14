import type { ModalsProviderProps } from '@egodb/ui'
import { SelectCalendarFieldModal } from './components/calendar-ui/select-calendar-field-modal'
import { CreateFieldModal } from './components/create-field-form/create-field-modal'
import { CreateOptionModal } from './components/create-option-form/create-option-form-modal'
import { UpdateOptionModal } from './components/update-option-form/update-option-modal'

export const CREATE_FIELD_MODAL_ID = 'CREATE_FIELD'
export const UDPATE_OPTION_MODAL_ID = 'UPDATE_OPTION'
export const CREATE_OPTION_MODAL_ID = 'CREAT_OPTION'
export const SELECT_CALENDAR_FIELD_MODAL_ID = 'CREATE_FIELD'

export const modals: ModalsProviderProps['modals'] = {
  [CREATE_FIELD_MODAL_ID]: CreateFieldModal,
  [UDPATE_OPTION_MODAL_ID]: UpdateOptionModal,
  [CREATE_OPTION_MODAL_ID]: CreateOptionModal,
  [SELECT_CALENDAR_FIELD_MODAL_ID]: SelectCalendarFieldModal,
}
