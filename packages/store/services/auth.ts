import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const auth = createApi({
  reducerPath: 'auth',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/auth' }),
  endpoints: (builder) => ({
    me: builder.query({
      query: () => 'me',
    }),
    register: builder.mutation<{ access_token: string }, { email: string; password: string }>({
      query: (data) => ({
        url: 'register',
        method: 'POST',
        body: data,
      }),
    }),
    login: builder.mutation<{ access_token: string }, { email: string; password: string }>({
      query: (data) => ({
        url: 'login',
        method: 'POST',
        body: data,
      }),
    }),
  }),
})

export const { useLoginMutation, useMeQuery, useRegisterMutation } = auth
