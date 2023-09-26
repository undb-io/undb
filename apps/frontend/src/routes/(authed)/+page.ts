import { trpc } from '$lib/trpc/client'
import { createTableInput } from '@undb/core'
import { superValidate } from 'sveltekit-superforms/server'
import type { PageLoad } from './$types'

export const ssr = false
export const prerender = false

export const load: PageLoad = async () => {
	return {
		bases: trpc().base.list.utils.fetch({}),
		createTable: superValidate({ name: '', schema: [] }, createTableInput, { id: 'createTable' }),
	}
}
