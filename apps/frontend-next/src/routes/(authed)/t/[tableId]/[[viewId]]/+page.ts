import { trpc } from '$lib/trpc/client'
import { TableFactory, createMutateRecordValuesSchema } from '@undb/core'
import { superValidate } from 'sveltekit-superforms/server'
import { z } from 'zod'
import type { PageLoad } from './$types'

export const ssr = false

export const load: PageLoad = async (event) => {
	const { tableId, viewId } = event.params
	const { table } = await event.parent()
	const coreTable = TableFactory.fromQuery(table)
	const view = coreTable.mustGetView(viewId)
	const fields = view.getOrderedFields(coreTable.schema.nonSystemFields)

	event.depends(`records:${tableId}`)

	return {
		records: trpc(event).record.list.query({ tableId }),
		createRecord: superValidate(createMutateRecordValuesSchema(fields), { id: 'createRecord' }),
		createField: superValidate(
			{ type: 'string' },
			z.object<{ [key: string]: any }>({
				type: z.string(),
			}),
			{ id: 'createField' },
		),
		updateField: superValidate(z.object<{ [key: string]: any }>({}), { id: 'updateField' }),
	}
}
