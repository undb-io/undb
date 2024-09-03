import { createTRPCProxyClient, httpLink } from "@trpc/client"
import type { AppRouter } from "@undb/trpc"

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpLink({
      url: "/trpc",
    }),
  ],
})
