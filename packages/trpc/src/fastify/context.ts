import type { inferAsyncReturnType } from '@trpc/server'
import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'

export function createContext({ req, res }: CreateFastifyContextOptions): CreateFastifyContextOptions {
  return { req, res }
}
export type Context = inferAsyncReturnType<typeof createContext>
