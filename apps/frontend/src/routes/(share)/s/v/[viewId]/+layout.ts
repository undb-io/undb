import { trpc } from '$lib/trpc/client'
import type { LayoutLoad } from './$types'

export const ssr = false
export const prerender = false

export const load: LayoutLoad = async (event) => {
	const viewId = event.params.viewId

	event.depends(`share:view:${viewId}`)

	const recordId = event.url.searchParams.get('r')

	return {
		share: await trpc().share.table.utils.fetch({ target: { id: viewId, type: 'view' } }),
		record: recordId ? await trpc().share.viewRecord.utils.fetch({ viewId, id: recordId }) : undefined,
	}
}
