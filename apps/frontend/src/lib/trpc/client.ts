import type { AppRouter } from '@undb/trpc'
import { createTRPCSvelte, httpBatchLink, loggerLink } from 'trpc-svelte-query'

export const trpc = () =>
	createTRPCSvelte<AppRouter>({
		links: [
			loggerLink({
				enabled: (opts) =>
					(process.env.NODE_ENV === 'development' && typeof window !== 'undefined') ||
					(opts.direction === 'down' && opts.result instanceof Error),
			}),
			httpBatchLink({
				url: '/api/trpc',
			}),
		],
	})
