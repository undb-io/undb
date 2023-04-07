import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export type User = any

export const auth = createApi({
  reducerPath: 'auth',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/auth' }),
  endpoints: (builder) => ({
    me: builder.query({
      query: () => 'me',
    }),
    login: builder.mutation<{ access_token: string }, { username: string; password: string }>({
      query: (data) => ({
        url: 'login',
        method: 'POST',
        body: data,
      }),
    }),
  }),
})

export const { useLoginMutation, useMeQuery } = auth
