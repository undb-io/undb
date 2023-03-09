import type { AppRouter } from '@egodb/trpc'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'

export const trpc: ReturnType<typeof createTRPCProxyClient<AppRouter>> = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:4000/api/trpc',
    }),
  ],
})
