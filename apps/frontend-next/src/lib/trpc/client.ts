// lib/trpc/client.ts
import { httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@undb/trpc'
import { createTRPCClient, type TRPCClientInit } from 'trpc-sveltekit'

let browserClient: ReturnType<typeof createTRPCClient<AppRouter>>

export function trpc(init?: TRPCClientInit) {
	const isBrowser = typeof window !== 'undefined'
	if (isBrowser && browserClient) return browserClient
	const client = createTRPCClient<AppRouter>({
		init,
		links: [
			httpBatchLink({
				url: 'http://0.0.0.0:4000/api/trpc',
			}),
		] as any,
	})
	if (isBrowser) browserClient = client
	return client
}
