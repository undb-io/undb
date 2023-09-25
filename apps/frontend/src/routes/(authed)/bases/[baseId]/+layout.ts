import { trpc } from '$lib/trpc/client'
import type { LayoutLoad } from './$types'

export const ssr = false
export const prerender = false

export const load: LayoutLoad = async (e) => {
	const baseId = e.params.baseId

	return {
		baseTables: trpc().table.list.utils.fetch({ baseId }),
	}
}
