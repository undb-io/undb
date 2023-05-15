import { trpc } from '$lib/trpc/client'
import {
	RecordFactory,
	TableFactory,
	createMutateRecordValuesSchema,
	createOptionSchema,
	createUpdateTableSchema,
	createViewSchema,
	updateOptionSchema,
} from '@undb/core'
import { superValidate } from 'sveltekit-superforms/server'
import { z } from 'zod'
import type { PageLoad } from './$types'

export const ssr = false

export const load: PageLoad = async (event) => {
	const { tableId, viewId } = event.params
	const { table } = await event.parent()
	if (!table) {
		throw new Error('not found table')
	}
	const coreTable = TableFactory.fromQuery(table)
	const view = coreTable.mustGetView(viewId)
	const fields = view.getOrderedFields(coreTable.schema.nonSystemFields)

	const recordId = event.url.searchParams.get('r')

	const record = recordId ? await trpc().record.get.utils.fetch({ tableId, id: recordId }) : undefined
	const coreRecord = record ? RecordFactory.fromQuery(record, coreTable.schema.toIdMap()).unwrap() : undefined

	return {
		record,
		updateTable: superValidate(
			{
				name: coreTable.name.value,
				emoji: coreTable.emoji.unpack(),
				schema: fields.map((field) => field.json as any),
			},
			createUpdateTableSchema(coreTable),
			{
				id: 'updateTable',
			},
		),
		createRecord: superValidate(event, createMutateRecordValuesSchema(fields), { id: 'createRecord', errors: false }),
		updateRecord: superValidate(event, createMutateRecordValuesSchema(fields, coreRecord?.valuesJSON), {
			id: 'updateRecord',
			errors: false,
		}),
		createField: superValidate(
			{ type: 'string' },
			z.object<{ [key: string]: any }>({
				type: z.string(),
			}),
			{ id: 'createField' },
		),
		updateField: superValidate(
			{
				type: 'string',
			},
			z.object<{ [key: string]: any }>({ type: z.string() }),
			{
				id: 'updateField',
			},
		),
		createOption: superValidate({}, createOptionSchema, { id: 'createOption' }),
		updateOption: superValidate({}, updateOptionSchema, { id: 'createOption' }),
		createView: superValidate({}, createViewSchema, { id: 'createView', errors: false }),
	}
}
