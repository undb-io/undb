import { trpc } from '$lib/trpc/client'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async (event) => {
	const member = await trpc(event).user.users.query({})

	return json(member, {
		headers: {
			'cache-control': 'public, max-age=3600',
		},
	})
}
