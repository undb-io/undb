import { trpc } from '$lib/trpc/client'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async (event) => {
	const { tableId, recordId } = event.params

	return {
		record: trpc(event).record.get.query({ tableId, id: recordId }),
	}
}
