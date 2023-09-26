import { trpc } from '$lib/trpc/client'
import type { PageLoad } from './$types'

export const ssr = false
export const prerender = false

export const load: PageLoad = (e) => {
	const baseId = e.params.baseId

	e.depends('baseTables')

	return {
		baseTables: trpc().table.list.utils.fetch({ baseId }),
	}
}
