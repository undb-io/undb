import { trpc } from '$lib/trpc/client'
import { TableFactory, createMutateRecordValuesSchema } from '@undb/core'
import { superValidate } from 'sveltekit-superforms/server'
import type { LayoutLoad } from './$types'

export const ssr = false
export const prerender = false

export const load: LayoutLoad = async (event) => {
	const formId = event.params.formId

	event.depends(`share:view:${formId}`)

	const share = await trpc().share.table.utils.fetch({ target: { id: formId, type: 'form' } })

	const table = TableFactory.fromQuery(share.table)
	const fields = table.schema.fields

	return {
		share,
		createShareRecord: superValidate({}, createMutateRecordValuesSchema(fields), {
			id: 'createShareRecord',
			errors: false,
		}),
	}
}
