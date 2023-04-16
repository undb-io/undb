import { trpc } from '$lib/trpc/client'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ fetch, url }) => {
	return {
		tables: await trpc({ fetch, url }).table.list.query({}),
	}
}
