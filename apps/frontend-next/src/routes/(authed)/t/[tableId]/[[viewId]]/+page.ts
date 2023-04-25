import { trpc } from '$lib/trpc/client'
import { RecordFactory, TableFactory, createMutateRecordValuesSchema } from '@undb/core'
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

	const recordId = event.url.searchParams.get('r')

	const record = recordId ? await trpc(event).record.get.query({ tableId, id: recordId }) : undefined
	const coreRecord = record ? RecordFactory.fromQuery(record, coreTable.schema.toIdMap()).unwrap() : undefined
	return {
		record,
		createRecord: superValidate(createMutateRecordValuesSchema(fields), { id: 'createRecord' }),
		updateRecord: superValidate(createMutateRecordValuesSchema(fields, coreRecord?.valuesJSON), { id: 'updateRecord' }),
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
