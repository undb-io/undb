import { trpc } from '$lib/trpc/client'
import { redirect } from '@sveltejs/kit'
import type { ICollaboratorProfile } from '@undb/core'
import Cookies from 'js-cookie'
import type { LayoutLoad } from './$types'

export const ssr = false
export const prerender = true
export const load: LayoutLoad = async (event) => {
	if (!Cookies.get('undb_auth')) {
		throw redirect(303, `/login?redirectTo=${event.url.pathname}`)
	}

	const me = await event.fetch('/api/auth/me', {})

	return {
		tables: trpc(event).table.list.query({}),
		me: me.json() as Promise<{ me: ICollaboratorProfile }>,
	}
}
