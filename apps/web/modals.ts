import type { ModalsProviderProps } from '@egodb/ui'
import { SelectCalendarFieldModal } from './components/calendar-ui/select-calendar-field-modal'
import { CreateFieldModal } from './components/create-field-form/create-field-modal'
import { CreateOptionModal } from './components/create-option-form/create-option-form-modal'
import { SelectKanbanFieldModal } from './components/kanban-ui/select-kanban-field-modal'
import { SelectTreeViewFieldModal } from './components/tree-view-ui/select-tree-view-field-modal'
import { UpdateOptionModal } from './components/update-option-form/update-option-modal'
import { CreateViewModal } from './components/view/create-view-modal'

export const CREATE_FIELD_MODAL_ID = 'CREATE_FIELD'
export const CREATE_VIEW_MODAL_ID = 'CREATE_VIEW'
export const UDPATE_OPTION_MODAL_ID = 'UPDATE_OPTION'
export const CREATE_OPTION_MODAL_ID = 'CREAT_OPTION'
export const SELECT_CALENDAR_FIELD_MODAL_ID = 'SELECT_CALENDAR_FIELD'
export const SELECT_KANBAN_FIELD_MODAL_ID = 'SELECT_KANBAN_FIELD'
export const SELECT_TREE_VIEW_FIELD_MODAL_ID = 'SELECT_TREE_VIEW_FIELD_MODAL_ID'

export const modals: ModalsProviderProps['modals'] = {
  [CREATE_FIELD_MODAL_ID]: CreateFieldModal,
  [CREATE_VIEW_MODAL_ID]: CreateViewModal,
  [UDPATE_OPTION_MODAL_ID]: UpdateOptionModal,
  [CREATE_OPTION_MODAL_ID]: CreateOptionModal,
  [SELECT_CALENDAR_FIELD_MODAL_ID]: SelectCalendarFieldModal,
  [SELECT_KANBAN_FIELD_MODAL_ID]: SelectKanbanFieldModal,
  [SELECT_TREE_VIEW_FIELD_MODAL_ID]: SelectTreeViewFieldModal,
}
