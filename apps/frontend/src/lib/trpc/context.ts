import type { RequestEvent } from '@sveltejs/kit'
import type { inferAsyncReturnType } from '@trpc/server'

export async function createContext(event: RequestEvent) {
	const token = event.cookies.get('undb_auth')
	return { token }
}

export type Context = inferAsyncReturnType<typeof createContext>
