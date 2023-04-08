import type { AppRouter } from '@egodb/trpc'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'

export const trpc: ReturnType<typeof createTRPCProxyClient<AppRouter>> = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/api/trpc',
      headers() {
        const token = localStorage.getItem('access_token')
        if (!token) {
          return {}
        }
        return {
          authorization: `Bearer ${token}`,
        }
      },
    }),
  ],
})
