/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ICreateFieldSchema, RecordValueJSON } from '@undb/core'
import { derived, writable } from 'svelte/store'
import { createRecordFormId } from './table'

export const createRecordInitial = writable<RecordValueJSON | undefined>()
export const createFieldInitial = writable<Partial<ICreateFieldSchema> | undefined>()

export const confirmDeleteField = writable<boolean>(false)
export const confirmBulkDeleteRecords = writable<boolean>(false)

export const confirmDeleteRecord = writable<boolean>(false)
export const confirmDuplicateRecord = writable<boolean>(false)
export const confirmBulkDuplicateRecords = writable<boolean>(false)

const createModal = (id: symbol) => {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	const modal = writable({ id, open: false, callback: async () => {} })
	const { set, update, subscribe } = modal

	const open = (cb?: () => Promise<any>) => {
		return update(($modal) => {
			$modal.open = true
			if (cb) {
				$modal.callback = cb
			}
			return $modal
		})
	}

	const close = () =>
		update(($modal) => {
			$modal.open = false
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			$modal.callback = async () => {}
			return $modal
		})

	return {
		set,
		update,
		subscribe,

		open,
		close,
	}
}

const CREATE_RECORD = Symbol('CREATE_RECORD')
export const createRecordModal = createModal(CREATE_RECORD)
export const createRecordCallback = derived(createRecordModal, ($modal) => $modal.callback)
createRecordModal.subscribe(({ open }) => {
	if (!open) {
		createRecordFormId.set(undefined)
	}
})

const CREATE_TABLE = Symbol('CREATE_TABLE')
export const createTableModal = createModal(CREATE_TABLE)

const UDPATE_TABLE = Symbol('UPDATE_TABLE')
export const updateTableModal = createModal(UDPATE_TABLE)

const CREATE_FIELD = Symbol('CREATE_FIELD')
export const createFieldModal = createModal(CREATE_FIELD)

const UPDATE_FIELD = Symbol('UPDATE_FIELD')
export const updateFieldModal = createModal(UPDATE_FIELD)

const DUPLICATE_FIELD = Symbol('DUPLICATE_FIELD')
export const duplicateFieldModal = createModal(DUPLICATE_FIELD)

const VIRSUALIZATION_DETAIL = Symbol('VIRSUALIZATION_DETAIL')
export const visualizationModal = createModal(VIRSUALIZATION_DETAIL)

const CONFIG_VIEW = Symbol('CONFIG_VIEW')
export const configViewModal = createModal(CONFIG_VIEW)

const CREATE_OPTION = Symbol('CREATE_OPTION')
export const createOptionModal = createModal(CREATE_OPTION)

const UPDATE_OPTION = Symbol('UPDATE_OPTION')
export const updateOptionModal = createModal(UPDATE_OPTION)

const MERGE_DATA_MODAL = Symbol('MERGE_DATA_MODAL')
export const mergeDataModal = createModal(MERGE_DATA_MODAL)

const IMPORT_DATA_MODAL = Symbol('IMPORT_DATA_MODAL')
export const importDataModal = createModal(IMPORT_DATA_MODAL)

const IMPORT_TEMPLATE = Symbol('IMPORT_TEMPLATE')
export const importTemplate = createModal(IMPORT_TEMPLATE)

const EXPORT_TABLE_TEMPLATE = Symbol('EXPORT_TABLE_TEMPLATE')
export const exportTableTemplate = createModal(EXPORT_TABLE_TEMPLATE)

const ERD_MODAL = Symbol('ERD_MODAL')
export const erdModal = createModal(ERD_MODAL)

const FORM_EDITOR_MODAL = Symbol('FORM_EDITOR_MODAL')
export const formEditorModal = createModal(FORM_EDITOR_MODAL)

const RECORD_TRASH_MODAL = Symbol('RECORD_TRASH_MODAL')
export const recordTrashModal = createModal(RECORD_TRASH_MODAL)

const FLS_MODAL = Symbol('FLS_MODAL')
export const flsModal = createModal(FLS_MODAL)

const RLS_MODAL = Symbol('RLS_MODAL')
export const rlsModal = createModal(RLS_MODAL)

const INVITE_MODAL = Symbol('INVITE_MODAL')
export const inviteModal = createModal(INVITE_MODAL)

const WBHOOK_MODAL = Symbol('WBHOOK_MODAL')
export const webhookModal = createModal(WBHOOK_MODAL)

const FORM_LIST_DRAWER = Symbol('FORM_LIST_DRAWER')
export const formListDrawer = createModal(FORM_LIST_DRAWER)

export const confirmCreateApiToken = writable(false)

export const viewsSideBarOpen = writable(false)

const CREATE_BASE_MODAL = Symbol('CREATE_BASE_MODAL')
export const createBaseModal = createModal(CREATE_BASE_MODAL)

const MOVE_TO_BASE_MODAL = Symbol('MOVE_TO_BASE_MODAL')
export const moveToBaseModal = createModal(MOVE_TO_BASE_MODAL)

const SELECT_TABLE_MOVE_TO_BASE_MODAL = Symbol('SELECT_TABLE_MOVE_TO_BASE_MODAL')
export const selectTableMoveToBaseModal = createModal(SELECT_TABLE_MOVE_TO_BASE_MODAL)

export const confirmDeleteBase = writable(false)

const CONFIRM_EXPORT_BASE_TEMPLATE = Symbol('CONFIRM_EXPORT_BASE_TEMPLATE')
export const confirmExportBaseTemplate = createModal(CONFIRM_EXPORT_BASE_TEMPLATE)

export const confirmDuplicateView = writable(false)
export const confirmUpdateViewName = writable(false)
export const confirmCreateFormFromView = writable(false)

export const confirmDeleteTable = writable(false)
