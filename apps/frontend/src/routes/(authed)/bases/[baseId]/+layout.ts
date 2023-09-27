import { trpc } from '$lib/trpc/client'
import { error } from '@sveltejs/kit'
import type { LayoutLoad } from './$types'

export const ssr = false
export const prerender = false

export const load: LayoutLoad = async (e) => {
	const baseId = e.params.baseId

	const base = await trpc().base.getById.utils.fetch({ id: baseId })

	if (!base) {
		throw error(404)
	}

	return {
		base,
	}
}
