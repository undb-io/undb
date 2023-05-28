import { superValidate } from 'sveltekit-superforms/server'
import { z } from 'zod'
import type { PageLoad } from './$types'

const schema = z.object({
	email: z.string().email(),
	password: z.string(),
})

export const ssr = false
export const prerender = false
export const load: PageLoad = async () => {
	const form = await superValidate({}, schema)

	return { form }
}
