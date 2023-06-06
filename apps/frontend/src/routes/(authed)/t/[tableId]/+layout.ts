import { trpc } from '$lib/trpc/client'
import type { LayoutLoad } from './$types'

export const ssr = false
export const prerender = 'auto'
export const load: LayoutLoad = (event) => {
	const { tableId } = event.params

	event.depends(`table:${tableId}`)

	return {
		table: trpc().table.get.utils.fetch({ id: tableId }),
	}
}
