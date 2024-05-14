import { createTRPCProxyClient, httpBatchLink } from "@trpc/client"
import type { AppRouter } from "@undb/trpc"

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "/trpc",
    }),
  ],
})
