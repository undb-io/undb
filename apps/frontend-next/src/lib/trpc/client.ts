// lib/trpc/client.ts
import type { AppRouter } from '@undb/trpc'
import { createTRPCClient, type TRPCClientInit } from 'trpc-sveltekit'

let browserClient: ReturnType<typeof createTRPCClient<AppRouter>>

export function trpc(init?: TRPCClientInit) {
	const isBrowser = typeof window !== 'undefined'
	if (isBrowser && browserClient) return browserClient
	const client = createTRPCClient<AppRouter>({
		init,
		url: '/api/trpc',
	})
	if (isBrowser) browserClient = client
	return client
}
