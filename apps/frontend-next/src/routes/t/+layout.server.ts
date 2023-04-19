import { trpc } from '$lib/trpc/client'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async (event) => {
	return {
		tables: await trpc(event).table.list.query({}),
	}
}
