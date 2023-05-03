import type { AppRouter } from '@undb/trpc'
import { createTRPCSvelte, httpBatchLink } from 'trpc-svelte-query'

export const trpc = () =>
	createTRPCSvelte<AppRouter>({
		links: [
			httpBatchLink({
				url: '/api/trpc',
			}),
		],
	})
