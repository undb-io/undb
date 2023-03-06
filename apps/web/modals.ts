import dynamic from 'next/dynamic'

const SelectCalendarFieldModal = dynamic(() =>
  import('./features/calendar-ui/select-calendar-field-modal').then((m) => m.SelectCalendarFieldModal),
)
const CreateFieldModal = dynamic(() =>
  import('./features/create-field-form/create-field-modal').then((m) => m.CreateFieldModal),
)
const CreateOptionModal = dynamic(() =>
  import('./features/create-option-form/create-option-form-modal').then((m) => m.CreateOptionModal),
)
const SelectKanbanFieldModal = dynamic(() =>
  import('./features/kanban-ui/select-kanban-field-modal').then((m) => m.SelectKanbanFieldModal),
)
const SelectTreeViewFieldModal = dynamic(() =>
  import('./features/tree-view-ui/select-tree-view-field-modal').then((m) => m.SelectTreeViewFieldModal),
)
const UpdateFieldModal = dynamic(() =>
  import('./features/update-field-form/update-field-modal').then((m) => m.UpdateFieldModal),
)
const UpdateOptionModal = dynamic(() =>
  import('./features/update-option-form/update-option-modal').then((m) => m.UpdateOptionModal),
)
const CreateViewModal = dynamic(() => import('./features/view/create-view-modal').then((m) => m.CreateViewModal))

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
