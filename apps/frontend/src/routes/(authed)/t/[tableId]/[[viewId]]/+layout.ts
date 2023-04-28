import { trpc } from '$lib/trpc/client'
import type { LayoutLoad } from './$types'

export const ssr = false
export const prerender = 'auto'
export const load: LayoutLoad = (event) => {
	const { tableId, viewId } = event.params

	event.depends(`table:${tableId}`)
	event.depends(`records:${tableId}`)

	return {
		table: trpc(event).table.get.query({ id: tableId }),
		records: trpc(event).record.list.query({ tableId, viewId }),
	}
}
