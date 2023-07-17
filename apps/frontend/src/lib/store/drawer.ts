import type { IQueryWebhook } from '@undb/integrations'
import { derived, writable } from 'svelte/store'
import { currentTable } from './table'

const createDrawer = (id: symbol) => {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	const drawer = writable({ id, hidden: true, callback: async () => {} })
	const { set, update, subscribe } = drawer

	const open = (cb?: () => Promise<never>) => {
		return update(($modal) => {
			$modal.hidden = false
			if (cb) {
				$modal.callback = cb
			}
			return $modal
		})
	}

	const close = () =>
		update(($modal) => {
			$modal.hidden = true
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

const WEBHOOK_LIST_DRAWER = Symbol('WEBHOOK_LIST_DRAWER')
export const webhookListDrawer = createDrawer(WEBHOOK_LIST_DRAWER)

export const webhookDrawerMode = writable<'list' | 'create' | 'update'>('list')

export const selectedWebhook = writable<IQueryWebhook | undefined>(undefined)

const FORM_LIST_DRAWER = Symbol('FORM_LIST_DRAWER')
export const formListDrawer = createDrawer(FORM_LIST_DRAWER)

export const formDrawerMode = writable<'list' | 'create'>('list')

export const selectedFormId = writable<string | undefined>(undefined)

export const selectedForm = derived([currentTable, selectedFormId], ([$table, $formId]) =>
	$formId ? $table.forms.getById($formId).into() : undefined,
)
