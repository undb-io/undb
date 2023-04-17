import { trpc } from '$lib/trpc/client'
import type { PageLoad } from './$types'

export const load: PageLoad = async (page) => {
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
