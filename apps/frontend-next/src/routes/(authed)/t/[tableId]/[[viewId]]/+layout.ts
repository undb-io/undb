import { trpc } from '$lib/trpc/client'
import type { LayoutLoad } from './$types'

export const ssr = false
export const prerender = 'auto'
export const load: LayoutLoad = (event) => {
	const id = event.params.tableId

	event.depends(`table:${id}`)
	event.depends(`records:${id}`)

	return {
		table: trpc(event).table.get.query({ id }),
		records: trpc(event).record.list.query({ tableId: id }),
	}
}
