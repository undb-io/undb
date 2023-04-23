import { trpc } from '$lib/trpc/client'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import { createTableInput } from '@undb/core'
import { superValidate } from 'sveltekit-superforms/server'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	// Server API:
	const createTable = await superValidate(createTableInput)

	// Always return { form } in load and form actions.
	return { createTable }
}

export const actions: Actions = {
	createTable: async (event) => {
		const createTable = await superValidate(event.request, createTableInput)

		if (!createTable.valid) {
			// Again, always return { form } and things will just work.
			return fail(400, { form: createTable })
		}

		const { id } = await trpc(event).table.create.mutate(createTable.data)

		if (id) {
			throw redirect(303, `/t/${id}`)
		}

		return { form: createTable, id }
	},
}
