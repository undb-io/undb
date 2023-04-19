import { redirect, type Actions } from '@sveltejs/kit'

export const actions: Actions = {
	default: ({ cookies }) => {
		cookies.delete('undb_auth', { path: '/' })
		throw redirect(303, '/')
	},
}
