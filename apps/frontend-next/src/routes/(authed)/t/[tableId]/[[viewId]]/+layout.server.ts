import { trpc } from '$lib/trpc/client'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = (event) => {
	const id = event.params.tableId

	event.depends(`table:${id}`)
	event.depends(`records:${id}`)

	return {
		table: trpc(event).table.get.query({ id }),
		records: trpc(event).record.list.query({ tableId: id }),
	}
}
