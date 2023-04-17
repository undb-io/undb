import { trpc } from '$lib/trpc/client'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import { createTableInput } from '@undb/core'
import { superValidate } from 'sveltekit-superforms/server'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	// Server API:
	const form = await superValidate(createTableInput)

	// Always return { form } in load and form actions.
	return { form }
}

export const actions: Actions = {
	createTable: async ({ request, fetch, url }) => {
		const form = await superValidate(request, createTableInput)

		if (!form.valid) {
			// Again, always return { form } and things will just work.
			return fail(400, { form })
		}

		const { id } = await trpc({ fetch, url }).table.create.mutate(form.data)

		throw redirect(303, `/t/${id}`)

		return { form, id }
	},
}
