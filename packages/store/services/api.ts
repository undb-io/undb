import { createApi } from '@reduxjs/toolkit/query/react'
import type { TRPCError } from '@undb/trpc'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: (trpcResult: Promise<unknown>) =>
    trpcResult.then((data) => ({ data })).catch((error: TRPCError) => ({ error })),
  endpoints: () => ({}),
  tagTypes: ['Table', 'Record', 'TreeRecord'],
})
