import { trpc } from '$lib/trpc/client'
import type { LayoutLoad } from './$types'

export const ssr = false
export const prerender = 'auto'
export const load: LayoutLoad = (event) => {
	const { tableId, viewId } = event.params

	event.depends(`table:${tableId}`)
	event.depends(`records:${tableId}`)

	return {
		table: trpc().table.get.utils.fetch({ id: tableId }),
		records: trpc().record.list.utils.fetch({ tableId, viewId }),
	}
}
