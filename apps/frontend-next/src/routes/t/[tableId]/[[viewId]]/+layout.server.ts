import { trpc } from '$lib/trpc/client'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = (event) => {
	const id = event.params.tableId

	return {
		table: trpc(event).table.get.query({ id }),
	}
}
