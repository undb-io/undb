import type { IQueryWebhook } from '@undb/integrations'
import { writable } from 'svelte/store'

const createDrawer = (id: symbol) => {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	const drawer = writable({ id, hidden: true, callback: async () => {} })
	const { set, update, subscribe } = drawer

	const open = (cb?: () => Promise<any>) => {
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
