import { trpc } from '$lib/trpc/client'
import type { PageLoad } from './$types'

export const ssr = false
export const prerender = true
export const load: PageLoad = async () => {
	return {
		members: trpc.user.users.utils.fetch({}),
	}
}
