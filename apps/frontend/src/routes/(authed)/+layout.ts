import { trpc } from '$lib/trpc/client'
import { redirect } from '@sveltejs/kit'
import Cookies from 'js-cookie'
import type { LayoutLoad } from './$types'

export const ssr = false
export const prerender = false
export const load: LayoutLoad = async (event) => {
	if (!Cookies.get('undb_auth')) {
		redirect(303, `/login?redirectTo=${event.url.pathname}`)
	}

	const { me } = await event.parent()

	const m = await me

	if (!m.me) {
		redirect(303, `/login?redirectTo=${event.url.pathname}`)
	}

	event.depends('app:tables', 'app:bases', 'app:me')

	return {
		bases: await trpc().base.list.utils.fetch({}),
		tables: await trpc().table.list.utils.fetch({}),
		me,
	}
}
