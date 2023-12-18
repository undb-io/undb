import { trpc } from '$lib/trpc/client'
import type { PageLoad } from './$types'

export const ssr = false
export const prerender = false

export const load: PageLoad = async (e) => {
	const baseId = e.params.baseId

	e.depends('app:baseTables')

	return {
		baseTables: await trpc().table.list.utils.fetch({ baseId }),
	}
}
