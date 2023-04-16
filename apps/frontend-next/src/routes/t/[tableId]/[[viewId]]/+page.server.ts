import { trpc } from '$lib/trpc/client'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async (page) => {
	const id = page.params.tableId
	const [table, { records }] = await Promise.all([
		trpc(page).table.get.query({ id }),
		trpc(page).record.list.query({ tableId: id }),
	])
	return {
		table,
		records,
	}
}
