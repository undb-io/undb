import { trpc } from '$lib/trpc/client'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async (event) => {
	const id = event.params.tableId

	return {
		records: trpc(event).record.list.query({ tableId: id }),
	}
}
