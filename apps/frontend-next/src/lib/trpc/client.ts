// lib/trpc/client.ts
import type { Cookies } from '@sveltejs/kit'
import { httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@undb/trpc'
import { createTRPCClient, type TRPCClientInit } from 'trpc-sveltekit'

let browserClient: ReturnType<typeof createTRPCClient<AppRouter>>

export function trpc(init?: TRPCClientInit & { cookies?: Cookies }) {
	const isBrowser = typeof window !== 'undefined'
	if (isBrowser && browserClient) return browserClient
	const client = createTRPCClient<AppRouter>({
		init,
		url: '/api/trpc',
		links: [
			httpBatchLink({
				url: isBrowser ? '/api/trpc' : 'http://0.0.0.0:4000/api/trpc',
				headers: {
					Authorization: 'Bearer ' + init?.cookies?.get('undb_auth'),
				},
			}),
		] as any,
	})
	if (isBrowser) browserClient = client
	return client
}
