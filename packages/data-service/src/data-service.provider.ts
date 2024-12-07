import { inject } from "@undb/di"
import type { AppRouter, CreateTRPCProxyClient } from "@undb/trpc"

export const IS_LOCAL = Symbol.for("IS_LOCAL")

export const injectIsLocal = () => inject(IS_LOCAL)

export const TRPC_CLIENT = Symbol.for("TRPC_CLIENT")

export const injectTrpcClient = () => inject(TRPC_CLIENT)

export type TrpcProxyClient = CreateTRPCProxyClient<AppRouter>

export const IS_PLAYGROUND = Symbol.for("IS_PLAYGROUND")

export const injectIsPlayground = () => inject(IS_PLAYGROUND)
