import loadable from '@loadable/component'

const SelectCalendarFieldModal = loadable(() => import('./features/calendar-ui/select-calendar-field-modal'))
const CreateFieldModal = loadable(() => import('./features/create-field-form/create-field-modal'))
const CreateOptionModal = loadable(() => import('./features/create-option-form/create-option-form-modal'))
const SelectKanbanFieldModal = loadable(() => import('./features/kanban-ui/select-kanban-field-modal'))
const SelectTreeViewFieldModal = loadable(() => import('./features/tree-view-ui/select-tree-view-field-modal'))
const UpdateFieldModal = loadable(() => import('./features/update-field-form/update-field-modal'))
const UpdateOptionModal = loadable(() => import('./features/update-option-form/update-option-modal'))
const CreateViewModal = loadable(() => import('./features/view/create-view-modal'))

export const CREATE_FIELD_MODAL_ID = 'CREATE_FIELD'
export const UPDATE_FIELD_MODAL_ID = 'UPDATE_FIELD'
export const CREATE_VIEW_MODAL_ID = 'CREATE_VIEW'
export const UDPATE_OPTION_MODAL_ID = 'UPDATE_OPTION'
export const CREATE_OPTION_MODAL_ID = 'CREAT_OPTION'
export const SELECT_CALENDAR_FIELD_MODAL_ID = 'SELECT_CALENDAR_FIELD'
export const SELECT_KANBAN_FIELD_MODAL_ID = 'SELECT_KANBAN_FIELD'
export const SELECT_TREE_VIEW_FIELD_MODAL_ID = 'SELECT_TREE_VIEW_FIELD_MODAL_ID'

export const modals = {
  [CREATE_FIELD_MODAL_ID]: CreateFieldModal,
  [UPDATE_FIELD_MODAL_ID]: UpdateFieldModal,
  [CREATE_VIEW_MODAL_ID]: CreateViewModal,
  [UDPATE_OPTION_MODAL_ID]: UpdateOptionModal,
  [CREATE_OPTION_MODAL_ID]: CreateOptionModal,
  [SELECT_CALENDAR_FIELD_MODAL_ID]: SelectCalendarFieldModal,
  [SELECT_KANBAN_FIELD_MODAL_ID]: SelectKanbanFieldModal,
  [SELECT_TREE_VIEW_FIELD_MODAL_ID]: SelectTreeViewFieldModal,
}
