import { trpc } from '$lib/trpc/client'
import type { ICollaboratorProfile } from '@undb/core'
import type { LayoutLoad } from './$types'

export const ssr = false
export const prerender = true
export const load: LayoutLoad = async (event) => {
	// if (!event.cookies.get('undb_auth')) {
	// 	throw redirect(303, `/login?redirectTo=${event.url.pathname}`)
	// }

	const me = await event.fetch('http://0.0.0.0:4000/api/auth/me', {})

	return {
		tables: trpc(event).table.list.query({}),
		me: me.json() as Promise<{ me: ICollaboratorProfile }>,
	}
}
