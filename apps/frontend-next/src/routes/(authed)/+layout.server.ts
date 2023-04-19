import { trpc } from '$lib/trpc/client'
import { redirect } from '@sveltejs/kit'
import type { ICollaboratorProfile } from '@undb/core'
import type { LayoutServerLoad } from './t/$types'

export const load: LayoutServerLoad = async (event) => {
	if (!event.cookies.get('undb_auth')) {
		throw redirect(303, `/login?redirectTo=${event.url.pathname}`)
	}

	const me = await event.fetch('http://0.0.0.0:4000/api/auth/me', {
		headers: { Authorization: `Bearer ${event.cookies.get('undb_auth')}` },
	})

	return {
		tables: trpc(event).table.list.query({}),
		me: me.json() as Promise<{ me: ICollaboratorProfile }>,
	}
}
