import { fail, redirect, type Actions } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'
import { z } from 'zod'
import type { PageServerLoad } from './$types'

const schema = z.object({
	email: z.string().email(),
	password: z.string(),
})

export const load: PageServerLoad = async () => {
	const form = await superValidate(schema)

	return { form }
}

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, schema)
		if (!form.valid) {
			return fail(400, { form })
		}

		const response = await event.fetch('http://127.0.0.1:4000/api/auth/register', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(form.data),
		})

		const data = await response.json()
		const token = data.access_token
		event.cookies.set('undb_auth', token)

		throw redirect(303, event.url.searchParams.get('redirectTo') ?? '/')
	},
}
