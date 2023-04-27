import { trpc } from '$lib/trpc/client'
import { redirect } from '@sveltejs/kit'
import Cookies from 'js-cookie'
import type { LayoutLoad } from './$types'

export const ssr = false
export const prerender = true
export const load: LayoutLoad = async (event) => {
	if (!Cookies.get('undb_auth')) {
		throw redirect(303, `/login?redirectTo=${event.url.pathname}`)
	}

	const { me } = await event.parent()
	if (!me.me) {
		throw redirect(303, `/login?redirectTo=${event.url.pathname}`)
	}

	event.depends('tables')

	return {
		tables: trpc(event).table.list.query({}),
		me,
	}
}
