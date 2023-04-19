import { trpc } from '$lib/trpc/client'
import { fail, redirect } from '@sveltejs/kit'
import { TableFactory, createMutateRecordValuesSchema } from '@undb/core'
import { superValidate } from 'sveltekit-superforms/server'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async (event) => {
	const { tableId, viewId } = event.params
	const { table } = await event.parent()
	const coreTable = TableFactory.fromQuery(table)
	const view = coreTable.mustGetView(viewId)
	const fields = view.getOrderedFields(coreTable.schema.nonSystemFields)
	const createRecord = await superValidate(createMutateRecordValuesSchema(fields))

	return {
		records: trpc(event).record.list.query({ tableId }),
		createRecord,
	}
}

export const actions: Actions = {
	createRecord: async (event) => {
		const { tableId } = event.params
		const table = await trpc(event).table.get.query({ id: tableId })
		const coreTable = TableFactory.fromQuery(table)

		const form = await superValidate(event, createMutateRecordValuesSchema(coreTable.schema.fields))

		if (!form.valid) {
			return fail(400, { createRecord: form })
		}

		const { id } = await trpc(event).record.create.mutate({
			tableId,
			values: form.data,
		})

		if (id) {
			throw redirect(303, `/t/${tableId}/r/${id}`)
		}

		return { form, id }
	},
}
