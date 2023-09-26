import { trpc } from '$lib/trpc/client'
import { redirect } from '@sveltejs/kit'
import Cookies from 'js-cookie'
import type { LayoutLoad } from './$types'

export const ssr = false
export const prerender = false
export const load: LayoutLoad = async (event) => {
	if (!Cookies.get('undb_auth')) {
		throw redirect(303, `/login?redirectTo=${event.url.pathname}`)
	}

	const { me } = await event.parent()
	if (!me.me) {
		throw redirect(303, `/login?redirectTo=${event.url.pathname}`)
	}

	event.depends('tables', 'bases', 'me')

	return {
		bases: trpc().base.list.utils.fetch({}),
		tables: trpc().table.list.utils.fetch({}),
		me,
	}
}
