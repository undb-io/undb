import { trpc } from '$lib/trpc/client'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = (event) => {
	const id = event.params.tableId

	event.depends(`table:${id}`)

	return {
		table: trpc(event).table.get.query({ id }),
	}
}
