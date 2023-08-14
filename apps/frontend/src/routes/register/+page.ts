import { superValidate } from 'sveltekit-superforms/server'
import { z } from 'zod'
import type { PageLoad } from './$types'

export const ssr = false
export const prerender = false

export const load: PageLoad = async ({ url }) => {
	const form = await superValidate(
		{},
		z.object({
			email: z
				.string()
				.email()
				.default(url.searchParams.get('email') ?? ''),
			password: z.string(),
		}),
	)

	return { form }
}
