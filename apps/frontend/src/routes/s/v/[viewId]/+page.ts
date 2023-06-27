import { trpc } from '$lib/trpc/client'
import type { PageLoad } from './$types'

export const ssr = false
export const prerender = false

export const load: PageLoad = async (event) => {
	const viewId = event.params.viewId

	return {
		share: trpc().share.view.utils.fetch({ viewId }),
	}
}
