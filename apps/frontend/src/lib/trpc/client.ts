import { createTRPCProxyClient, httpLink } from "@trpc/client"
import { TRPC_CLIENT } from "@undb/data-service"
import { container } from "@undb/di"
import type { AppRouter } from "@undb/trpc"

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpLink({
      url: "/trpc",
    }),
  ],
})

container.register(TRPC_CLIENT, { useValue: trpc })
