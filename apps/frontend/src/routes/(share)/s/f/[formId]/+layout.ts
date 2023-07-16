import { trpc } from '$lib/trpc/client'
import type { LayoutLoad } from './$types'

export const ssr = false
export const prerender = false

export const load: LayoutLoad = async (event) => {
	const formId = event.params.formId

	event.depends(`share:view:${formId}`)

	return {
		share: trpc().share.table.utils.fetch({ target: { id: formId, type: 'form' } }),
	}
}
