import { trpc } from '$lib/trpc/client'
import type { PageLoad } from './$types'

export const ssr = false
export const prerender = false
export const load: PageLoad = async () => {
	return {
		members: trpc().authz.member.list.utils.fetch(),
	}
}
