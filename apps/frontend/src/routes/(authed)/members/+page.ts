import { trpc } from '$lib/trpc/client'
import type { PageLoad } from './$types'

export const ssr = false
export const prerender = true
export const load: PageLoad = async (event) => {
	return {
		members: trpc(event).user.users.query({}),
	}
}
